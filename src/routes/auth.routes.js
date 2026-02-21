const express = require('express');
const router = express.Router();
const { registerUser, loginUser, regenerateCode } = require('../controllers/auth.controller');

router.post('/users', registerUser);       // inscription + génération code
router.post('/login', loginUser);          // connexion
router.patch('/users', regenerateCode);    // régénérer code (forgot)

module.exports = router;
