const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendOTPEmail, sendWelcomeEmail } = require('../services/emailService');

// Generate OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Temporary storage (DEV only)
const pendingRegistrations = new Map();

/* =========================
   SEND OTP
========================= */
router.post('/signup/send-otp', async (req, res) => {
  try {
    const { firstName, email, password } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);

    pendingRegistrations.set(email, {
      firstName,
      email,
      password: hashedPassword,
      otp,
      otpExpiry
    });

    await sendOTPEmail(email, otp, firstName);

    res.json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
   VERIFY OTP
========================= */
router.post('/signup/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const data = pendingRegistrations.get(email);

    if (!data) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (data.otp !== otp || new Date() > data.otpExpiry) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const user = await User.create({
      name: data.firstName,
      email: data.email,
      password: data.password,
      isVerified: true
    });

    pendingRegistrations.delete(email);

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    sendWelcomeEmail(user.email, user.name).catch(() => {});

    res.json({
      success: true,
      message: 'Account created',
      token,
      user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Resend OTP
router.post('/signup/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      });
    }

    // Get pending registration
    const pendingData = pendingRegistrations.get(email);
    
    if (!pendingData) {
      return res.status(400).json({
        success: false,
        message: 'No pending registration found. Please signup again.'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update pending data
    pendingData.otp = otp;
    pendingData.otpExpiry = otpExpiry;
    pendingRegistrations.set(email, pendingData);

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, pendingData.firstName);
    } catch (emailError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email address'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resending OTP',
      error: error.message
    });
  }
});

// Legacy Email/Password Signup (keeping for backward compatibility)
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, newsletter } = req.body;
    
    if (!firstName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name: `${firstName} ${lastName}`.trim(),
      email,
      password: hashedPassword,
      newsletter: newsletter || false,
      isVerified: true // Auto-verify for email signup
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating account',
      error: error.message
    });
  }
});

// Email/Password Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
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



// Get user profile (requires auth)
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-otp -otpExpiry');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, email },
      { new: true, runValidators: true }
    ).select('-otp -otpExpiry');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// Add address
router.post('/address/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.addresses.push(req.body);
    await user.save();
    
    res.json({
      success: true,
      message: 'Address added successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding address',
      error: error.message
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

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
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
      await sendOTPEmail(email, otp, user.name);
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

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

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
