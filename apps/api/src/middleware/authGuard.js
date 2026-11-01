import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// JWT Authentication Guard with short expiration and HttpOnly cookie / Bearer support
export const authGuard = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer '))
    ? authHeader.split(' ')[1]
    : req.cookies?.ts_auth_token;

  if (!token) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
      message: 'Access denied: Valid JWT authentication token required.'
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      status: 403,
      error: 'Forbidden',
      message: 'Invalid or expired authentication credentials.'
    });
  }
};
