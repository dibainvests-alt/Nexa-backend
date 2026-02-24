const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Health check (Railway)
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'OK', env: process.env.NODE_ENV });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 NexaTank API running on port ${PORT}`);
});