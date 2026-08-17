const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });
//dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to ensure database connection is ready for serverless requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection error in request middleware:', err.message);
    res.status(500).json({ success: false, message: 'Database connection failed. Please check MONGO_URI / MONGODB_URI in environment variables.' });
  }
});

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// HTTP request logger
if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
  app.use(morgan('dev'));
}

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    }
  })
);

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || process.env.VERCEL) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  })
);

// Rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api', limiter);

// Serve uploaded files
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// ================================
// API ROUTES
// ================================

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/students', require('./routes/studentRoutes'));

app.use('/api/companies', require('./routes/companyRoutes'));

app.use('/api/jobs', require('./routes/jobRoutes'));

app.use(
  '/api/applications',
  require('./routes/applicationRoutes')
);

app.use('/api/reviews', require('./routes/reviewRoutes'));

app.use('/api/messages', require('./routes/messageRoutes'));

app.use(
  '/api/notifications',
  require('./routes/notificationRoutes')
);

app.use('/api/admin', require('./routes/adminRoutes'));

app.use(
  '/api/categories',
  require('./routes/categoryRoutes')
);

// ================================
// HEALTH CHECK
// ================================

app.get('/', (req, res) => {
  res.send('Student Job Portal API is running...');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy and running'
  });
});

// ================================
// ERROR HANDLER
// ================================

app.use(errorHandler);

// ================================
// LOCAL DEVELOPMENT SERVER
// ================================

// Vercel provides the VERCEL environment variable.
// Therefore app.listen() should only run locally.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `Server running in ${
        process.env.NODE_ENV || 'development'
      } mode on port ${PORT}`
    );
  });
}

// ================================
// UNHANDLED PROMISE REJECTIONS
// ================================

process.on('unhandledRejection', (err) => {
  console.error(
    `Unhandled Rejection Error: ${err.message}`
  );

  // Don't forcefully close the Vercel serverless function
  // because Vercel manages the function lifecycle.
  if (!process.env.VERCEL) {
    process.exit(1);
  }
});

// Export Express app for Vercel
module.exports = app;