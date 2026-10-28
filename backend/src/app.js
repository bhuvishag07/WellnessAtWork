import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import apiRoutes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
const productionClientUrl = 'https://wellness-at-work-eight.vercel.app';

// Safe origin validator supporting configured CLIENT_URL and local Vite ports (5173-5180, 3000)
export const isOriginAllowed = (origin) => {
  if (!origin) return true; // Mobile apps, curl, server-to-server
  const cleanOrigin = origin.replace(/\/+$/, '');
  if (cleanOrigin === clientUrl || cleanOrigin === productionClientUrl) return true;
  // Local development origins only
  return process.env.NODE_ENV !== 'production' &&
    /^https?:\/\/(localhost|127\.0\.0\.1):(517[3-9]|5180|3000)$/.test(cleanOrigin);
};

// CORS configuration supporting credentials and safe explicit origins
const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Fail startup if the API contract is missing or invalid instead of serving empty docs.
const openapiPath = path.resolve(__dirname, '../docs/openapi.json');
const swaggerDocument = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));

// Mount Swagger UI at /api/docs
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'WellnessAtWork API Documentation — Case Study 72',
    customCss: '.swagger-ui .topbar { display: none }'
  })
);

// Raw OpenAPI JSON endpoint
app.get('/api/docs.json', (req, res) => {
  res.json(swaggerDocument);
});

// Mount API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'WellnessAtWork Backend API',
    description: 'Case Study 72 — Full Stack & Backend Engineering',
    status: 'Operational',
    documentation: '/api/docs',
    port: process.env.PORT || 7500
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
