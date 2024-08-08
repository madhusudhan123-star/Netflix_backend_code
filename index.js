const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const winston = require('winston');
const authRoutes = require('./router/auth');
const videos = require('./router/videos');
const profile = require('./router/profile');
const moviesRouter = require('./router/movies');
const tv_ShowRouter = require('./router/tv_show');
const search = require('./router/search');
require('dotenv').config();

// Configure winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

app.use(express.json());
app.use(cors());

// Middleware to log requests
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    logger.info(`${req.method} ${req.url}`);
  }
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.database, {})
  .then(() => {
    logger.info('Connected to MongoDB');
  }).catch((err) => {
    logger.error('Error connecting to MongoDB', { error: err.message });
  });

// Routes
app.use('/api', authRoutes);
app.use('/api', videos);
app.use('/api', profile);
app.use('/api/movies', moviesRouter);
app.use('/api/tvshow', tv_ShowRouter);
app.use('/api', search); // ?query=your-name

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});
