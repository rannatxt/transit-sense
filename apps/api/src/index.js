import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { corsConfig } from './middleware/corsConfig.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import telemetryRoutes from './routes/telemetry.js';
import streamsRoutes from './routes/streams.js';
import exportRoutes from './routes/export.js';

const app = express();

// 1. Production Security Headers via Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://unpkg.com", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://*.basemaps.cartocdn.com"],
      connectSrc: ["'self'", "wss://gateway.transitsense.gov.in", "https://*.basemaps.cartocdn.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// 2. Strict CORS Configuration
app.use(corsConfig);

// 3. Rate Limiter (Anti-DDoS, 100 req/min/IP)
app.use('/api/', apiRateLimiter);

// 4. Request Parsers
app.use(express.json({ limit: '100kb' })); // Mitigate payload flooding
app.use(cookieParser());

// 5. Hardened API Routes
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/streams', streamsRoutes);
app.use('/api/export', exportRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    service: 'Transit Sense API Gateway',
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV
  });
});

// Fallback error handler (Zero stack trace leaks in production)
app.use((err, req, res, next) => {
  console.error('[API ERROR]', err.message);
  res.status(500).json({
    status: 500,
    error: 'Internal Server Error',
    message: env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred. Request logged.'
  });
});

app.listen(env.PORT, () => {
  console.log(`🛡️ Transit Sense Hardened API Gateway listening on port ${env.PORT} [${env.NODE_ENV}]`);
});
