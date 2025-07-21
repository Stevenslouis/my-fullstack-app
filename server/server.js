// ================================================
// 1. Environment Setup
// ================================================
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ debug: true }); // Load .env only in development
}

// Debug: Log critical environment variables (redact sensitive values)
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL ? '***SET***' : 'MISSING',
  MONGODB_URI: process.env.MONGODB_URI ? 'mongodb://***redacted***' : 'MISSING',
  PORT: process.env.PORT || 'DEFAULT (3000)'
});

// ================================================
// 2. Validate Required Variables
// ================================================
const requiredVars = ['MONGODB_URI', 'CLIENT_URL', 'JWT_SECRET'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('CRITICAL: Missing environment variables:', missingVars);
  process.exit(1);
}

// ================================================
// 3. Initialize Express
// ================================================
const express = require('express');
const app = express();

// ================================================
// 4. Middleware
// ================================================
app.use(express.json());
app.use(require('cors')({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(require('cookie-parser')());

// ================================================
// 5. Database Connection
// ================================================
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// ================================================
// 6. Routes
// ================================================
app.use('/api/quizzes', require('./routes/quiz-route'));
app.use('/api/auth', require('./routes/auth-route'));

// Health check endpoint
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// ================================================
// 7. Error Handling
// ================================================
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ================================================
// 8. Start Server
// ================================================
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Server and MongoDB connection closed');
      process.exit(0);
    });
  });
});