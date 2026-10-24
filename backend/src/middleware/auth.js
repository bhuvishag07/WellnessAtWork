import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';
import { getJwtSecret } from '../services/authService.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check HTTP-only cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Check Authorization Bearer Header (fallback / flexibility)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, {
        statusCode: 401,
        message: 'Authentication required. No session token provided.'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, getJwtSecret());
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return errorResponse(res, {
          statusCode: 401,
          message: 'Your session has expired. Please sign in again.'
        });
      }
      if (error.name === 'JsonWebTokenError') {
        return errorResponse(res, {
          statusCode: 401,
          message: 'Invalid authentication token.'
        });
      }
      return next(error);
    }

    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user || decoded.ver !== (user.tokenVersion || 0)) {
      return errorResponse(res, {
        statusCode: 401,
        message: 'This session is no longer valid. Please sign in again.'
      });
    }

    req.user = user;
  } catch (error) {
    return next(error);
  }
  return next();
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, {
        statusCode: 403,
        message: `Forbidden. Role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this resource.`
      });
    }
    next();
  };
};
