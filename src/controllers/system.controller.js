const systemService = require('../services/systemService');

/**
 * Récupère l'état actuel du système (Mode et Message)
 */
async function getStatus(req, res) {
  try {
    const settings = await systemService.getSystemSettings();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

/**
 * Active ou désactive le mode maintenance
 */
async function toggleMaintenance(req, res) {
  try {
    const { mode } = req.body; // Attend 'true' ou 'false'
    await systemService.updateSystemSetting('maintenance_mode', mode);
    res.json({ 
      success: true, 
      message: `Système ${mode === 'true' ? 'VERROUILLÉ' : 'DÉVERROUILLÉ'} avec succès.` 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

/**
 * Met à jour le message affiché aux utilisateurs
 */
async function updateMessage(req, res) {
  try {
    const { message } = req.body;
    await systemService.updateSystemSetting('maintenance_message', message);
    res.json({ success: true, message: 'Message de maintenance mis à jour.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

module.exports = { getStatus, toggleMaintenance, updateMessage };