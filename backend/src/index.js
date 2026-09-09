require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running smoothly' });
});

// API Routes
app.use('/api/auth', authRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'An unexpected error occurred' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
