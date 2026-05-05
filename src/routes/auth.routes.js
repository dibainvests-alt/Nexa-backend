const express = require('express');
const router = express.Router();
const { registerUser, loginUser, regenerateCode } = require('../controllers/auth.controller');
const { validateRegister, validateLogin, validateRegenerateCode } = require('../middlewares/validation.middleware');

router.post('/users', validateRegister, registerUser);                    // inscription + génération code
router.post('/login', validateLogin, loginUser);                          // connexion
router.patch('/users', validateRegenerateCode, regenerateCode);           // régénérer code (forgot)

module.exports = router;
