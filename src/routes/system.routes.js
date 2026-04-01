const express = require('express');
const router = express.Router();
const systemController = require('../controllers/system.controller');
const { requireAuth, superAdminOnly } = require('../middlewares/auth.middleware');

// Toutes les routes système sont protégées et réservées au SuperAdmin
router.get('/status', requireAuth, superAdminOnly, systemController.getStatus);
router.post('/toggle', requireAuth, superAdminOnly, systemController.toggleMaintenance);
router.post('/message', requireAuth, superAdminOnly, systemController.updateMessage);

module.exports = router;