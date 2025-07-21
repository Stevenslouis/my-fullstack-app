require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDB = require('./database/database');

// Validate env vars
if (!process.env.CLIENT_URL || !process.env.MONGO_URI) {
  throw new Error('Missing required environment variables');
}

const app = express();

// Security middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/quizzes', require('./routes/quiz-route'));
app.use('/api/auth', require('./routes/auth-route'));

// Health check
app.get('/health', (req, res) => res.sendStatus(200));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Database connection
connectToDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed', err);
    process.exit(1);
  });