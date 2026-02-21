const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Génère un code numérique à 4 chiffres
 */
function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * REGISTER
 * Rôles autorisés via l'API :
 * - user  (Pompiste)
 * - admin (Gérant, 1 seul autorisé)
 * superAdmin = création manuelle uniquement (SQL)
 */
async function registerUser(req, res) {
  try {
    let { name, role, phone } = req.body;

    // Validation basique
    if (!name || !role || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Champs manquants',
      });
    }

    // Mapping et validation stricte des rôles
    const roleMap = {
      user: 'user',     // Pompiste
      admin: 'admin',   // Gérant
    };

    if (!roleMap[role]) {
      return res.status(400).json({
        success: false,
        message: 'Rôle invalide',
      });
    }

    role = roleMap[role];

    // Vérifier s'il existe déjà un admin
    if (role === 'admin') {
      const adminCheck = await pool.query(
        `SELECT id FROM users WHERE role = 'admin' LIMIT 1`
      );
      if (adminCheck.rows.length > 0) {
        return res.status(403).json({
          success: false,
          message: 'Un seul Gérant (admin) est autorisé pour cette station.',
        });
      }
    }

    // Génération du code
    const plainCode = generateCode();
    const hashedCode = await bcrypt.hash(plainCode, 10);

    // Insertion utilisateur
    const query = `
      INSERT INTO users (name, role, phone, code)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, phone, role, created_at
    `;
    const values = [name, role, phone, hashedCode];

    const result = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      code: parseInt(plainCode, 10), // à afficher une seule fois côté mobile
      user: result.rows[0],
    });

  } catch (err) {
    console.error('REGISTER ERROR:', err);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
    });
  }
}

/**
 * LOGIN
 */
async function loginUser(req, res) {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        message: 'Champs manquants',
      });
    }

    const result = await pool.query(
      `SELECT * FROM users WHERE phone = $1`,
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(code.toString(), user.code);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Code invalide',
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    await pool.query(
      `UPDATE users SET last_login = NOW() WHERE id = $1`,
      [user.id]
    );

    return res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
    });
  }
}

/**
 * REGENERATE CODE
 */
async function regenerateCode(req, res) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Téléphone manquant',
      });
    }

    const plainCode = generateCode();
    const hashedCode = await bcrypt.hash(plainCode, 10);

    const result = await pool.query(
      `UPDATE users SET code = $1 WHERE phone = $2 RETURNING id`,
      [hashedCode, phone]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    return res.json({
      success: true,
      message: 'Nouveau code généré',
      code: parseInt(plainCode, 10),
    });

  } catch (err) {
    console.error('REGENERATE CODE ERROR:', err);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  regenerateCode,
};
