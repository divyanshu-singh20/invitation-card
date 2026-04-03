// Design Controller
const Design = require('../models/Design');

exports.getAllDesigns = async (req, res) => {
  try {
    const designs = await Design.find();
    res.json(designs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDesignById = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.json(design);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add more design-related controller functions as needed
