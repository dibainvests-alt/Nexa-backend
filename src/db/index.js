const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      }
);

// Test de connexion (non bloquant)
pool
  .query('SELECT 1')
  .then(() => console.log('🗄️ PostgreSQL connected'))
  .catch((err) =>
    console.error('❌ PostgreSQL connection error:', err.message)
  );

module.exports = pool;