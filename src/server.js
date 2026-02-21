const express = require('express');
const app = express();

const pool = require('./db');

app.use(express.json());

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

app.get('/health', (_, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 NexaTank API running on port ${PORT}`));
