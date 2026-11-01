import cors from 'cors';
import { env } from '../config/env.js';

// Strict CORS: Only allow trusted production domains, reject wildcards
const allowedOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim());

export const corsConfig = cors({
  origin: (origin, callback) => {
    // Allow server-to-server or trusted origins
    if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error(`CORS Violation: Origin ${origin} is not authorized by Transit Sense Security Policy`));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours preflight cache
});
