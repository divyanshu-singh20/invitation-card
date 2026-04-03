const jwt = require('jsonwebtoken');
const Seller = require('../models/Seller');

// Basic seller auth - just checks if logged in (for profile/status check)
const sellerAuthBasic = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('🔍 SellerAuthBasic - Token received:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔓 Token decoded:', { sellerId: decoded.sellerId, role: decoded.role });
    
    if (decoded.role !== 'seller') {
      console.log('❌ Not a seller role. Found:', decoded.role);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Not a seller.',
        tokenRole: decoded.role // Show what role was found
      });
    }

    const seller = await Seller.findById(decoded.sellerId);
    
    if (!seller) {
      console.log('❌ Seller not found in database');
      return res.status(401).json({
        success: false,
        message: 'Seller not found.'
      });
    }

    console.log('✅ Seller authenticated:', seller.email);
    req.seller = seller;
    req.sellerId = seller._id;
    next();
  } catch (error) {
    console.log('❌ Auth error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Authentication error.',
      error: error.message
    });
  }
};

// Full seller auth - requires approved status (for products/orders)
const sellerAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Not a seller.'
      });
    }

    const seller = await Seller.findById(decoded.sellerId);
    
    if (!seller) {
      return res.status(401).json({
        success: false,
        message: 'Seller not found.'
      });
    }

    if (seller.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Your account is not approved yet.',
        status: seller.status
      });
    }

    if (!seller.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated.'
      });
    }

    req.seller = seller;
    req.sellerId = seller._id;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Authentication error.',
      error: error.message
    });
  }
};

module.exports = { sellerAuth, sellerAuthBasic };
