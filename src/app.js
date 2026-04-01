const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const { globalSystemLock } = require('./middlewares/system.middleware');

const app = express();

/* =========================
   MIDDLEWARES GLOBAUX
========================= */
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(compression()); // Compression Gzip pour les performances mobile

// 🚫 Désactivation stricte du cache pour le temps réel
app.disable('etag'); 
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

/* =========================
   LE VERROU GLOBAL (Kill Switch)
   Doit être placé AVANT les routes API
========================= */
app.use(globalSystemLock);

/* =========================
   HEALTH CHECK (Toujours ouvert)
========================= */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'NexaTank API',
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   ROUTES API
========================= */

// Authentification (Login/Register)
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Tanks (Cuves & Calculs)
const tanksRoutes = require('./routes/tanks.routes');
app.use('/api/tanks', tanksRoutes);

// Routes protégées (Historique Measurements / Users)
const protectedRoutes = require('./routes/protected.routes');
app.use('/api', protectedRoutes);

// Contrôle Système (Joshua's Command)
const systemRoutes = require('./routes/system.routes');
app.use('/api/system', systemRoutes);

/* =========================
   ROUTE 404 (Sécurité)
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
  });
});

module.exports = app;