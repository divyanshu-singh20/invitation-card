// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// // Generate OTP (In production, use SMS service)
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Email/Password Signup
// router.post('/signup', async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, newsletter } = req.body;
    
//     if (!firstName || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide all required fields'
//       });
//     }
    
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already registered'
//       });
//     }
    
//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
    
//     // Create new user
//     const user = new User({
//       name: `${firstName} ${lastName}`.trim(),
//       email,
//       password: hashedPassword,
//       newsletter: newsletter || false,
//       isVerified: true // Auto-verify for email signup
//     });
    
//     await user.save();
    
//     // Generate token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '30d' }
//     );
    
//     res.status(201).json({
//       success: true,
//       message: 'Account created successfully',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error creating account',
//       error: error.message
//     });
//   }
// });

// // Email/Password Login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide email and password'
//       });
//     }
    
//     // Find user
//     const user = await User.findOne({ email });
//     if (!user || !user.password) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }
    
//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }
    
//     // Generate token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '30d' }
//     );
    
//     res.json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         mobile: user.mobile
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error logging in',
//       error: error.message
//     });
//   }
// });


// // Send OTP
// router.post('/send-otp', async (req, res) => {
//   try {
//     const { mobile } = req.body;
    
//     if (!mobile || mobile.length !== 10) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide a valid 10-digit mobile number'
//       });
//     }
    
//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
//     let user = await User.findOne({ mobile });
    
//     if (!user) {
//       user = new User({ mobile });
//     }
    
//     user.otp = otp;
//     user.otpExpiry = otpExpiry;
//     await user.save();
    
//     // In production, send OTP via SMS
//     console.log(`OTP for ${mobile}: ${otp}`);
    
//     res.json({
//       success: true,
//       message: 'OTP sent successfully',
//       // Remove this in production
//       otp: process.env.NODE_ENV === 'development' ? otp : undefined
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error sending OTP',
//       error: error.message
//     });
//   }
// });

// // Verify OTP and login
// router.post('/verify-otp', async (req, res) => {
//   try {
//     const { mobile, otp } = req.body;
    
//     const user = await User.findOne({ mobile });
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
    
//     if (user.otp !== otp) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid OTP'
//       });
//     }
    
//     if (new Date() > user.otpExpiry) {
//       return res.status(400).json({
//         success: false,
//         message: 'OTP expired'
//       });
//     }
    
//     user.isVerified = true;
//     user.otp = undefined;
//     user.otpExpiry = undefined;
//     await user.save();
    
//     const token = jwt.sign(
//       { userId: user._id, mobile: user.mobile },
//       process.env.JWT_SECRET,
//       { expiresIn: '30d' }
//     );
    
//     res.json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         mobile: user.mobile,
//         name: user.name,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error verifying OTP',
//       error: error.message
//     });
//   }
// });

// // Get user profile (requires auth)
// router.get('/profile/:userId', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId).select('-otp -otpExpiry');
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: user
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching profile',
//       error: error.message
//     });
//   }
// });

// // Update user profile
// router.put('/profile/:userId', async (req, res) => {
//   try {
//     const { name, email } = req.body;
    
//     const user = await User.findByIdAndUpdate(
//       req.params.userId,
//       { name, email },
//       { new: true, runValidators: true }
//     ).select('-otp -otpExpiry');
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'Profile updated successfully',
//       data: user
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: 'Error updating profile',
//       error: error.message
//     });
//   }
// });

// // Add address
// router.post('/address/:userId', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
    
//     user.addresses.push(req.body);
//     await user.save();
    
//     res.json({
//       success: true,
//       message: 'Address added successfully',
//       data: user
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: 'Error adding address',
//       error: error.message
//     });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ================= SIGNUP =================
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, newsletter } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name: `${firstName} ${lastName || ''}`.trim(),
      email,
      password: hashedPassword,
      newsletter: newsletter || false,
      isVerified: true
    });

    await user.save();

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
    console.log("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: 'Error creating account'
    });
  }
});

// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

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
    console.log("Login Error:", error);
    res.status(500).json({
      success: false,
      message: 'Error logging in'
    });
  }
});

// ================= SEND OTP =================
router.post('/send-otp', async (req, res) => {
  try {
    let { mobile } = req.body;

    mobile = mobile?.toString().trim();

    if (!mobile || mobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number'
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ mobile });

    if (!user) {
      user = new User({ mobile });
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    console.log(`OTP for ${mobile}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.log("Send OTP Error:", error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP'
    });
  }
});

// ================= VERIFY OTP =================
router.post('/verify-otp', async (req, res) => {
  try {
    let { mobile, otp } = req.body;

    mobile = mobile?.toString().trim();

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired'
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    const token = jwt.sign(
      { userId: user._id, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        mobile: user.mobile,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.log("Verify OTP Error:", error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP'
    });
  }
});

// ================= PROFILE =================
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
    console.log("Get Profile Error:", error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// ================= UPDATE PROFILE =================
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
    console.log("Update Profile Error:", error);
    res.status(400).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// ================= ADD ADDRESS =================
router.post('/address/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.addresses = user.addresses || [];
    user.addresses.push(req.body);

    await user.save();

    res.json({
      success: true,
      message: 'Address added successfully',
      data: user
    });
  } catch (error) {
    console.log("Add Address Error:", error);
    res.status(400).json({
      success: false,
      message: 'Error adding address'
    });
  }
});

module.exports = router;