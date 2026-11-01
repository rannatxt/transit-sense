import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

// Production IP-based sliding-window rate limiter (100 requests per minute per IP)
export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // 1 minute
  max: env.RATE_LIMIT_MAX_REQUESTS,   // limit each IP to 100 requests per window
  standardHeaders: true,              // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,               // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    error: 'Too Many Requests',
    message: 'Rate limit exceeded: Max 100 requests per minute per IP. Request throttled by Transit Sense DevSecOps policy.'
  }
});
