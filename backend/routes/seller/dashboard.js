const express = require('express');
const router = express.Router();
const SellerProduct = require('../../models/SellerProduct');
const Order = require('../../models/Order');
const Seller = require('../../models/Seller');
const { sellerAuth, sellerAuthBasic } = require('../../middleware/sellerAuth');

// Get seller status (accessible even if not approved)
router.get('/status', sellerAuthBasic, async (req, res) => {
  try {
    const seller = req.seller;
    
    res.json({
      success: true,
      data: {
        status: seller.status,
        isActive: seller.isActive,
        shopName: seller.shopName,
        ownerName: seller.ownerName,
        email: seller.email,
        createdAt: seller.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching status',
      error: error.message
    });
  }
});

// Get seller profile
router.get('/profile', sellerAuthBasic, async (req, res) => {
  try {
    const seller = await Seller.findById(req.sellerId).select('-password');
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    res.json({
      success: true,
      data: seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// Update seller profile
router.put('/profile', sellerAuthBasic, async (req, res) => {
  try {
    const {
      ownerName,
      phone,
      shopName,
      address,
      bankDetails
    } = req.body;

    const seller = await Seller.findById(req.sellerId);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    if (ownerName) seller.ownerName = ownerName;
    if (phone) seller.phone = phone;
    if (shopName) seller.shopName = shopName;
    if (address) seller.address = { ...seller.address, ...address };
    if (bankDetails) seller.bankDetails = { ...seller.bankDetails, ...bankDetails };

    await seller.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// Get dashboard overview
router.get('/overview', sellerAuth, async (req, res) => {
  try {
    // Product stats
    const totalProducts = await SellerProduct.countDocuments({ seller: req.sellerId });
    const activeProducts = await SellerProduct.countDocuments({ 
      seller: req.sellerId, 
      status: 'approved', 
      isActive: true 
    });
    const pendingProducts = await SellerProduct.countDocuments({ 
      seller: req.sellerId, 
      status: 'pending' 
    });
    const rejectedProducts = await SellerProduct.countDocuments({ 
      seller: req.sellerId, 
      status: 'rejected' 
    });

    // Get seller's product IDs for order queries
    const sellerProducts = await SellerProduct.find({ seller: req.sellerId }).select('_id views orders');
    const productIds = sellerProducts.map(p => p._id);

    // Calculate views and orders from products
    const totalViews = sellerProducts.reduce((sum, p) => sum + (p.views || 0), 0);
    const productOrders = sellerProducts.reduce((sum, p) => sum + (p.orders || 0), 0);

    // Order stats (if Order model has productId reference)
    let orderStats = {
      totalOrders: 0,
      pendingOrders: 0,
      processingOrders: 0,
      completedOrders: 0,
      totalRevenue: 0
    };

    // Recent products
    const recentProducts = await SellerProduct.find({ seller: req.sellerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title images status basePrice createdAt');

    // Get seller info
    const seller = await Seller.findById(req.sellerId).select('shopName ownerName email status');

    res.json({
      success: true,
      data: {
        seller,
        productStats: {
          total: totalProducts,
          active: activeProducts,
          pending: pendingProducts,
          rejected: rejectedProducts
        },
        orderStats,
        viewsAndOrders: {
          views: totalViews,
          orders: productOrders
        },
        recentProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

// Change password
router.put('/change-password', sellerAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const seller = await Seller.findById(req.sellerId);
    
    const isMatch = await seller.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    seller.password = newPassword;
    await seller.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
});

module.exports = router;
