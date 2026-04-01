// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// /**
//  * Vérifie que l'utilisateur est authentifié
//  */
// function requireAuth(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({
//       success: false,
//       message: 'Accès refusé. Token manquant.',
//     });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { id, role }
//     next();
//   } catch (err) {
//     return res.status(401).json({
//       success: false,
//       message: 'Token invalide ou expiré.',
//     });
//   }
// }

// /**
//  * Autorise uniquement les ADMIN
//  */
// function adminOnly(req, res, next) {
//   if (req.user.role !== 'admin' && req.user.role !== 'superAdmin') {
//     return res.status(403).json({
//       success: false,
//       message: 'Accès réservé au gérant.',
//     });
//   }
//   next();
// }

// /**
//  * Autorise uniquement le SUPER ADMIN
//  */
// function superAdminOnly(req, res, next) {
//   if (req.user.role !== 'superAdmin') {
//     return res.status(403).json({
//       success: false,
//       message: 'Accès réservé au Super Admin.',
//     });
//   }
//   next();
// }

// module.exports = {
//   requireAuth,
//   adminOnly,
//   superAdminOnly,
// };

const jwt = require('jsonwebtoken');
const { getSystemSettings } = require('../services/systemService');
require('dotenv').config();

/**
 * Vérifie que l'utilisateur est authentifié ET gère le mode maintenance
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Accès refusé. Token manquant.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }

    // --- VÉRIFICATION MODE MAINTENANCE ---
    const settings = await getSystemSettings();
    
    if (settings.maintenance_mode === 'true' && req.user.role !== 'superAdmin') {
      return res.status(503).json({
        success: false,
        maintenance: true,
        message: settings.maintenance_message || 'NexaTank est actuellement en maintenance.'
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré.',
    });
  }
}

/**
 * Autorise uniquement les ADMIN
 */
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin' && req.user.role !== 'superAdmin') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé au gérant.',
    });
  }
  next();
}

/**
 * Autorise uniquement le SUPER ADMIN
 */
function superAdminOnly(req, res, next) {
  if (req.user.role !== 'superAdmin') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé au Super Admin.',
    });
  }
  next();
}

module.exports = {
  requireAuth,
  adminOnly,
  superAdminOnly,
};