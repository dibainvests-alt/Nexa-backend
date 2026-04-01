const pool = require('../db');

async function getSystemSettings() {
  try {
    const result = await pool.query('SELECT key, value FROM system_settings');
    const settings = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    return settings;
  } catch (err) {
    console.error('Error fetching system settings:', err);
    return { maintenance_mode: 'false' }; // Par défaut ouvert en cas d'erreur
  }
}

async function updateSystemSetting(key, value) {
  await pool.query('UPDATE system_settings SET value = $1 WHERE key = $2', [value.toString(), key]);
}

module.exports = { getSystemSettings, updateSystemSetting };