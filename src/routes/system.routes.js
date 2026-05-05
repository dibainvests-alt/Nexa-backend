const express = require('express');
const router = express.Router();
const systemController = require('../controllers/system.controller');
const { requireAuth, superAdminOnly } = require('../middlewares/auth.middleware');
const { validateSystemMessage } = require('../middlewares/validation.middleware');

// Toutes les routes système sont protégées et réservées au SuperAdmin
router.get('/status', requireAuth, superAdminOnly, systemController.getStatus);
router.post('/toggle', requireAuth, superAdminOnly, systemController.toggleMaintenance);
router.post('/message', requireAuth, superAdminOnly, validateSystemMessage, systemController.updateMessage);

module.exports = router;