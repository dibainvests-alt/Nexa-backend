const express = require('express');
const router = express.Router();
const { postVolume, getTanks } = require('../controllers/tank.controller'); // Ajout de getTanks
const { requireAuth } = require('../middlewares/auth.middleware');
const rateLimiter = require('../middlewares/rateLimiter');
const { validatePostVolume } = require('../middlewares/validation.middleware');

// GET /api/tanks - Liste des cuves avec volume actuel (Public ou Protégé selon ton besoin)
router.get('/', getTanks);

// POST /api/tanks/volume (protégée, avec rate limiting et validation)
router.post('/volume', requireAuth, rateLimiter.middleware(), validatePostVolume, postVolume);

module.exports = router;