const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Connexion test immédiate
(async () => {
  try {
    await pool.connect();
    console.log('🗄️ PostgreSQL connected');
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
    process.exit(1); // stoppe le serveur si erreur
  }
})();

module.exports = pool;
