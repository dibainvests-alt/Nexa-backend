const express = require('express');
const router = express.Router();

const {
  requireAuth,
  adminOnly,
  superAdminOnly,
} = require('../middlewares/auth.middleware');

// Test utilisateur connecté
router.get('/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Utilisateur authentifié',
    user: req.user,
  });
});

// Test admin
router.get('/admin', requireAuth, adminOnly, (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue gérant',
  });
});

// Test super admin
router.get('/super-admin', requireAuth, superAdminOnly, (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue Super Admin Joshua',
  });
});

module.exports = router;
