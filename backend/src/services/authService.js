import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyFirebaseToken } from '../config/firebase.js';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters.');
  }
  return secret;
};

export const assertAuthConfig = () => getJwtSecret();

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      ver: user.tokenVersion || 0
    },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const setAuthCookie = (res, token, rememberMe = true) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  };
  if (rememberMe) cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000;
  res.cookie('token', token, cookieOptions);
};

export const clearAuthCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });
};

export const registerUser = async ({ fullName, email, password, department }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('An account with this email address already exists.');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    passwordHash,
    department,
    role: 'employee'
  });

  const token = generateToken(user);
  return { user, token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);
  return { user, token };
};

export const loginWithFirebase = async (idToken) => {
  const fbPayload = await verifyFirebaseToken(idToken);
  // email_verified is present on real Firebase tokens (always true for verified accounts).
  // In fallback/dev mode the field is absent — we skip that check so dev mode works.
  // If the field IS present and is explicitly false, reject (unverified email).
  if (!fbPayload.uid || !fbPayload.email) {
    const error = new Error('Firebase authentication failed: uid and email are required.');
    error.statusCode = 401;
    throw error;
  }
  if (fbPayload.email_verified === false) {
    const error = new Error('A verified Firebase email address is required.');
    error.statusCode = 401;
    throw error;
  }
  let user = await User.findOne({
    $or: [{ firebaseUid: fbPayload.uid }, { email: fbPayload.email.toLowerCase() }]
  });

  if (!user) {
    // Auto-provision employee profile for verified Firebase account
    const dummyPassword = await User.hashPassword(`FB-${Date.now()}-${Math.random()}`);
    user = await User.create({
      fullName: fbPayload.name || 'Firebase Employee',
      email: fbPayload.email.toLowerCase(),
      passwordHash: dummyPassword,
      department: 'Engineering',
      firebaseUid: fbPayload.uid,
      role: 'employee'
    });
  } else if (user.firebaseUid && user.firebaseUid !== fbPayload.uid) {
    const error = new Error('This email address is linked to another Firebase account.');
    error.statusCode = 409;
    throw error;
  } else if (!user.firebaseUid) {
    user.firebaseUid = fbPayload.uid;
    await user.save();
  }

  const token = generateToken(user);
  return { user, token };
};
