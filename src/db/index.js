const { Pool } = require('pg');
const dotenv = require('dotenv');

// Charger le bon fichier .env uniquement en local
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.development' });
}

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      }
);

// Connexion test immédiate
(async () => {
  try {
    await pool.connect();
    console.log('🗄️ PostgreSQL connected');
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
    process.exit(1);
  }
})();

module.exports = pool;
