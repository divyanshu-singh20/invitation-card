// Customization Controller
const Customization = require('../models/Customization');

exports.getAllCustomizations = async (req, res) => {
  try {
    const customizations = await Customization.find();
    res.json(customizations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCustomizationById = async (req, res) => {
  try {
    const customization = await Customization.findById(req.params.id);
    if (!customization) return res.status(404).json({ error: 'Customization not found' });
    res.json(customization);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add more customization-related controller functions as needed
