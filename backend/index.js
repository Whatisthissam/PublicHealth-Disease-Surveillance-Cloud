require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { testConnection } = require('./config/database');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman, same-origin)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
}));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/workflow', require('./routes/workflow'));
app.use('/api/monitoring', require('./routes/monitoring'));
app.use('/api/executive', require('./routes/executive'));
app.use('/api/regions', require('./routes/regions'));
app.use('/api/users', require('./routes/users'));

// Health check — available at both /health and /api/health
const healthHandler = (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running',
    service: 'PublicHealth Disease Surveillance API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: process.env.DB_HOST + ':' + (process.env.DB_PORT || 3306),
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// 404 + Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const start = async () => {
  try {
    await testConnection();
  } catch (err) {
    console.error('\n❌ Could not connect to MySQL.');
    console.error('   Make sure MySQL is running: brew services start mysql');
    console.error('   And DB_PASSWORD in backend/.env matches your MySQL root password.');
    console.error('   Error:', err.message, '\n');
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log('\n🚀 PublicHealth Disease Surveillance API');
    console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Server URL  : http://localhost:${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log(`   CORS Allowed: ${allowedOrigins.join(', ')}`);
    console.log('   Press Ctrl+C to stop\n');
  });
};

start();
