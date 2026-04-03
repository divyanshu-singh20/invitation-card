const express = require('express');
const router = express.Router();
const Settings = require('../../models/Settings');
const adminAuth = require('../../middleware/adminAuth');

// Apply admin auth to all routes
router.use(adminAuth);

// @route   GET /api/admin/settings
// @desc    Get all settings
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find().populate('updatedBy', 'name email');

    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = {
        value: setting.value,
        type: setting.type,
        description: setting.description,
        updatedAt: setting.updatedAt,
        updatedBy: setting.updatedBy
      };
    });

    res.json({
      success: true,
      settings: settingsObj
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching settings' 
    });
  }
});

// @route   PUT /api/admin/settings
// @desc    Update settings
// @access  Admin
router.put('/', async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid settings data' 
      });
    }

    // Update each setting
    const updatePromises = Object.keys(settings).map(key => {
      return Settings.setSetting(
        key, 
        settings[key].value, 
        settings[key].type || 'text',
        req.admin._id
      );
    });

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating settings' 
    });
  }
});

// @route   GET /api/admin/settings/:key
// @desc    Get single setting
// @access  Admin
router.get('/:key', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });

    if (!setting) {
      return res.status(404).json({ 
        success: false, 
        message: 'Setting not found' 
      });
    }

    res.json({
      success: true,
      setting
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching setting' 
    });
  }
});

// @route   PUT /api/admin/settings/:key
// @desc    Update single setting
// @access  Admin
router.put('/:key', async (req, res) => {
  try {
    const { value, type } = req.body;

    const setting = await Settings.setSetting(
      req.params.key,
      value,
      type || 'text',
      req.admin._id
    );

    res.json({
      success: true,
      message: 'Setting updated successfully',
      setting
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating setting' 
    });
  }
});

module.exports = router;
