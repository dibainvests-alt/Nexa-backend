const { getSystemSettings } = require('../services/systemService');
const jwt = require('jsonwebtoken');

async function globalSystemLock(req, res, next) {
  try {
    // 1. On vérifie l'état du verrou en base de données
    const settings = await getSystemSettings();
    
    if (settings.maintenance_mode === 'true') {
      // 2. On laisse toujours passer les routes de Login et de Joshua (SuperAdmin)
      // pour que vous puissiez déverrouiller le système
      if (req.path.includes('/api/auth/login') || req.path.includes('/api/system')) {
        return next();
      }

      // 3. On vérifie si l'utilisateur est SuperAdmin via son Token
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded.role === 'superAdmin') {
            return next(); // Joshua passe même en maintenance
          }
        } catch (e) {
          // Token invalide, on continue vers le blocage
        }
      }

      // 4. Blocage pour tous les autres
      return res.status(503).json({
        success: false,
        maintenance: true,
        message: settings.maintenance_message
      });
    }
    next();
  } catch (err) {
    // En cas d'erreur de connexion DB (Timeout), on laisse passer par précaution 
    // ou on bloque selon votre préférence. Ici on laisse passer pour éviter un crash total.
    next(); 
  }
}

module.exports = { globalSystemLock };