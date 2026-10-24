import { registerUser, loginUser, loginWithFirebase, setAuthCookie, clearAuthCookie } from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const { fullName, email, password, department } = req.body;
    const { user, token } = await registerUser({
      fullName,
      email,
      password,
      department
    });

    setAuthCookie(res, token);

    return successResponse(res, {
      statusCode: 201,
      message: 'Registration successful',
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    const { user, token } = await loginUser({ email, password });

    setAuthCookie(res, token, rememberMe !== false);

    return successResponse(res, {
      message: 'Login successful',
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    req.user.tokenVersion += 1;
    await req.user.save();
  } catch (error) {
    return next(error);
  }
  clearAuthCookie(res);
  return successResponse(res, {
    message: 'Logged out successfully'
  });
};

export const getMe = async (req, res) => {
  return successResponse(res, {
    message: 'User profile fetched',
    data: { user: req.user }
  });
};

export const firebaseLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Firebase ID token is required'
      });
    }

    const { user, token } = await loginWithFirebase(idToken);
    setAuthCookie(res, token);

    return successResponse(res, {
      message: 'Firebase authentication successful',
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};
