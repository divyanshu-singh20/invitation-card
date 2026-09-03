const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// Direct seller registration
router.post('/register', async (req, res) => {
  try {
    const {
      ownerName,
      email,
      phone,
      password,
      shopName,
      shopType,
      gstNumber,
      panNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      bankName,
      accountNumber,
      ifscCode,
      accountHolderName
    } = req.body;

    if (!ownerName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered. Please login or use different email.'
      });
    }

    // Check phone
    const existingPhone = await Seller.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered.'
      });
    }

    // Validation
    if (!shopName || !shopType || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = new Seller({
      ownerName,
      email,
      phone,
      shopName,
      shopType,
      gstNumber: gstNumber || '',
      panNumber: panNumber || '',
      address: {
        addressLine1,
        addressLine2: addressLine2 || '',
        city,
        state,
        pincode
      },
      bankDetails: {
        bankName: bankName || '',
        accountNumber: accountNumber || '',
        ifscCode: ifscCode || '',
        accountHolderName: accountHolderName || ''
      },
      status: 'pending',
      isEmailVerified: true
    });

    seller.password = hashedPassword;

    await seller.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully! Your application is under review. You will be notified once approved.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting registration',
      error: error.message
    });
  }
});

// Seller Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find seller
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if approved
    if (seller.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval. Please wait for admin to review your application.'
      });
    }

    if (seller.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: `Your application was rejected. Reason: ${seller.rejectionReason || 'Not specified'}`
      });
    }

    // Check if active
    if (!seller.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Check password
    const isMatch = await seller.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    seller.lastLogin = new Date();
    await seller.save();

    // Generate token
    const token = jwt.sign(
      { sellerId: seller._id, email: seller.email, role: 'seller' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      seller: {
        id: seller._id,
        ownerName: seller.ownerName,
        email: seller.email,
        shopName: seller.shopName,
        shopType: seller.shopType
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
});

// Direct seller password reset
router.post('/forgot-password/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'No seller account found with this email address'
      });
    }

    seller.password = newPassword;
    await seller.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
});

// Check registration status
router.get('/status/:email', async (req, res) => {
  try {
    const seller = await Seller.findOne({ email: req.params.email });
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'No registration found with this email'
      });
    }

    res.json({
      success: true,
      status: seller.status,
      shopName: seller.shopName,
      rejectionReason: seller.rejectionReason || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking status'
    });
  }
});

// ==================== END FORGOT PASSWORD ROUTE ====================

module.exports = router;
