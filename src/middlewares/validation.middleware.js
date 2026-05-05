const { body, param, validationResult } = require('express-validator');

/**
 * Middleware pour gérer les erreurs de validation
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * VALIDATION POUR L'AUTH
 */
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit avoir entre 2 et 100 caractères'),
  
  body('role')
    .notEmpty().withMessage('Le rôle est requis')
    .isIn(['user', 'admin']).withMessage('Rôle invalide (user ou admin)'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Le téléphone est requis')
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Numéro de téléphone invalide'),
  
  handleValidationErrors
];

const validateLogin = [
  body('phone')
    .trim()
    .notEmpty().withMessage('Le téléphone est requis')
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Numéro de téléphone invalide'),
  
  body('code')
    .trim()
    .notEmpty().withMessage('Le code est requis')
    .isLength({ min: 4, max: 4 }).withMessage('Le code doit contenir 4 caractères')
    .isNumeric().withMessage('Le code doit être numérique'),
  
  handleValidationErrors
];

const validateRegenerateCode = [
  body('phone')
    .trim()
    .notEmpty().withMessage('Le téléphone est requis')
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Numéro de téléphone invalide'),
  
  handleValidationErrors
];

/**
 * VALIDATION POUR LES TANKS
 */
const validatePostVolume = [
  body('tank_id')
    .notEmpty().withMessage('tank_id est requis')
    .isInt({ min: 1 }).withMessage('tank_id doit être un entier positif'),
  
  body('depth_cm')
    .notEmpty().withMessage('depth_cm est requis')
    .isFloat({ min: 0 }).withMessage('depth_cm doit être un nombre positif'),
  
  handleValidationErrors
];

/**
 * VALIDATION POUR LES PARAMÈTRES D'URL
 */
const validateUserId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID utilisateur invalide'),
  
  handleValidationErrors
];

/**
 * VALIDATION POUR LE SYSTÈME
 */
const validateSystemMessage = [
  body('message')
    .trim()
    .notEmpty().withMessage('Le message est requis')
    .isLength({ min: 1, max: 500 }).withMessage('Le message doit avoir entre 1 et 500 caractères'),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateRegenerateCode,
  validatePostVolume,
  validateUserId,
  validateSystemMessage,
  handleValidationErrors
};
