const express = require('express');
const router = express.Router();
const Customization = require('../models/Customization');

// Create customization
router.post('/', async (req, res) => {
  try {
    const customization = new Customization(req.body);
    await customization.save();
    
    res.status(201).json({
      success: true,
      message: 'Customization saved successfully',
      data: customization
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error saving customization',
      error: error.message
    });
  }
});

// Get customization by ID
router.get('/:id', async (req, res) => {
  try {
    const customization = await Customization.findById(req.params.id)
      .populate('design');
    
    if (!customization) {
      return res.status(404).json({
        success: false,
        message: 'Customization not found'
      });
    }
    
    res.json({
      success: true,
      data: customization
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching customization',
      error: error.message
    });
  }
});

// Update customization
router.put('/:id', async (req, res) => {
  try {
    const customization = await Customization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!customization) {
      return res.status(404).json({
        success: false,
        message: 'Customization not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Customization updated successfully',
      data: customization
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating customization',
      error: error.message
    });
  }
});

module.exports = router;
