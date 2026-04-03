const express = require('express');
const router = express.Router();
const Design = require('../../models/Design');
const adminAuth = require('../../middleware/adminAuth');

// Apply admin auth to all routes
router.use(adminAuth);

// @route   GET /api/admin/designs
// @desc    Get all designs (including disabled)
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const { category, status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (category) query.category = category;
    if (status) query.isActive = status === 'active';

    const designs = await Design.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Design.countDocuments(query);

    res.json({
      success: true,
      designs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalDesigns: count
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching designs' 
    });
  }
});

// @route   POST /api/admin/designs
// @desc    Create new design
// @access  Admin
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      images,
      price,
      paperTypes,
      customizationOptions,
      tags
    } = req.body;

    // Validation
    if (!name || !category || !price || !images || images.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const design = new Design({
      name,
      description,
      category,
      images,
      price,
      paperTypes,
      customizationOptions,
      tags,
      isActive: true
    });

    await design.save();

    res.status(201).json({
      success: true,
      message: 'Design created successfully',
      design
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error creating design' 
    });
  }
});

// @route   PUT /api/admin/designs/:id
// @desc    Update design
// @access  Admin
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      images,
      price,
      paperTypes,
      customizationOptions,
      tags
    } = req.body;

    const design = await Design.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        images,
        price,
        paperTypes,
        customizationOptions,
        tags
      },
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
      design
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating design' 
    });
  }
});

// @route   PATCH /api/admin/designs/:id/status
// @desc    Toggle design active status
// @access  Admin
router.patch('/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;

    const design = await Design.findByIdAndUpdate(
      req.params.id,
      { isActive },
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
      message: `Design ${isActive ? 'enabled' : 'disabled'} successfully`,
      design
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating design status' 
    });
  }
});

// @route   DELETE /api/admin/designs/:id
// @desc    Delete design (soft delete)
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const design = await Design.findByIdAndUpdate(
      req.params.id,
      { isActive: false, isDeleted: true },
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
      message: 'Error deleting design' 
    });
  }
});

module.exports = router;
