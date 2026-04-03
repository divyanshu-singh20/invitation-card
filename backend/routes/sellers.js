const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendOTPEmail } = require('../services/emailService');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Temporary storage for pending seller registrations
const pendingSellerRegistrations = new Map();

// Step 1: Send OTP for email verification
router.post('/send-otp', async (req, res) => {
  try {
    const { ownerName, email, phone, password } = req.body;

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

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store pending registration data
    pendingSellerRegistrations.set(email, {
      ownerName,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpiry,
      createdAt: new Date()
    });

    // Clean up old pending registrations (older than 15 minutes)
    for (const [key, value] of pendingSellerRegistrations.entries()) {
      if (new Date() - value.createdAt > 15 * 60 * 1000) {
        pendingSellerRegistrations.delete(key);
      }
    }

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, ownerName);
    } catch (emailError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email address',
      email: email
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
});

// Step 2: Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const pendingData = pendingSellerRegistrations.get(email);

    if (!pendingData) {
      return res.status(400).json({
        success: false,
        message: 'No pending registration found. Please start again.'
      });
    }

    // Check OTP expiry
    if (new Date() > pendingData.otpExpiry) {
      pendingSellerRegistrations.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    if (pendingData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }

    // OTP verified - mark as verified but don't create account yet
    pendingData.isVerified = true;
    pendingSellerRegistrations.set(email, pendingData);

    res.json({
      success: true,
      message: 'Email verified successfully! Please complete your registration.',
      email: email
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP'
    });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const pendingData = pendingSellerRegistrations.get(email);

    if (!pendingData) {
      return res.status(400).json({
        success: false,
        message: 'No pending registration found. Please start again.'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    pendingData.otp = otp;
    pendingData.otpExpiry = otpExpiry;
    pendingSellerRegistrations.set(email, pendingData);

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, pendingData.ownerName);
    } catch (emailError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.json({
      success: true,
      message: 'New OTP sent to your email'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resending OTP'
    });
  }
});

// Register new seller (after OTP verification)
router.post('/register', async (req, res) => {
  try {
    const {
      email,
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

    // Check if email was verified
    const pendingData = pendingSellerRegistrations.get(email);
    
    if (!pendingData || !pendingData.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email not verified. Please verify your email first.'
      });
    }

    // Validation
    if (!shopName || !shopType || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      pendingSellerRegistrations.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Email already registered. Please login or use different email.'
      });
    }

    // Create new seller with pre-hashed password from pending data
    const seller = new Seller({
      ownerName: pendingData.ownerName,
      email: pendingData.email,
      phone: pendingData.phone,
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

    // Set the pre-hashed password directly
    seller.password = pendingData.password;
    
    // Save without triggering pre-save hook for password
    await seller.save({ validateBeforeSave: false });

    // Clear pending registration
    pendingSellerRegistrations.delete(email);

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

// ==================== FORGOT PASSWORD ROUTES ====================

// Temporary storage for password reset OTPs
const passwordResetOTPs = new Map();

// Route 1: Send OTP for password reset
router.post('/forgot-password/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }

    // Check if seller exists
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'No seller account found with this email address'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP temporarily
    passwordResetOTPs.set(email, {
      otp,
      otpExpiry,
      createdAt: new Date()
    });

    // Clean up old OTPs
    for (const [key, value] of passwordResetOTPs.entries()) {
      if (new Date() - value.createdAt > 15 * 60 * 1000) {
        passwordResetOTPs.delete(key);
      }
    }

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, seller.ownerName);
    } catch (emailError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email address'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
});

// Route 2: Reset password with OTP
router.post('/forgot-password/reset-with-otp', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Get stored OTP
    const storedData = passwordResetOTPs.get(email);
    
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'No password reset request found. Please request a new OTP.'
      });
    }

    // Check OTP expiry
    if (new Date() > storedData.otpExpiry) {
      passwordResetOTPs.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }

    // Find seller
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    seller.password = hashedPassword;
    await seller.save();

    // Remove OTP from storage
    passwordResetOTPs.delete(email);

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

// ==================== END FORGOT PASSWORD ROUTES ====================

module.exports = router;
