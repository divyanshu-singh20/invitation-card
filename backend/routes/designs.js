const express = require('express');
const router = express.Router();
const Design = require('../models/Design');

// Get all designs with filters
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, paperType, color, featured } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.basePrice.$lte = parseFloat(maxPrice);
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    const designs = await Design.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: designs.length,
      data: designs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching designs',
      error: error.message
    });
  }
});

// Get design by ID
router.get('/:id', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }
    
    res.json({
      success: true,
      data: design
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching design',
      error: error.message
    });
  }
});

// Get categories with count
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Design.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// Create design (Admin only - add auth middleware in production)
router.post('/', async (req, res) => {
  try {
    const design = new Design(req.body);
    await design.save();
    
    res.status(201).json({
      success: true,
      message: 'Design created successfully',
      data: design
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating design',
      error: error.message
    });
  }
});

// Update design (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const design = await Design.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Design updated successfully',
      data: design
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating design',
      error: error.message
    });
  }
});

// Delete design (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const design = await Design.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Design deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting design',
      error: error.message
    });
  }
});

module.exports = router;
