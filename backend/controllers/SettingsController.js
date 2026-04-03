// Settings Controller
const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.find();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add more settings-related controller functions as needed
