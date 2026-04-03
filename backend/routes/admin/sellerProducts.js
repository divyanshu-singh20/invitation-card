const express = require('express');
const router = express.Router();
const SellerProduct = require('../../models/SellerProduct');
const adminAuth = require('../../middleware/adminAuth');

// Get all seller products (with filters)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, seller, category, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (seller) query.seller = seller;
    if (category) query.category = category;

    const skip = (page - 1) * limit;
    
    const products = await SellerProduct.find(query)
      .populate('seller', 'shopName ownerName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await SellerProduct.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get single product
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const product = await SellerProduct.findById(req.params.id)
      .populate('seller', 'shopName ownerName email phone');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// Approve product
router.patch('/:id/approve', adminAuth, async (req, res) => {
  try {
    const product = await SellerProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.status = 'approved';
    product.reviewedBy = req.admin._id;
    product.reviewedAt = new Date();
    product.rejectionReason = '';

    await product.save();

    res.json({
      success: true,
      message: 'Product approved successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving product',
      error: error.message
    });
  }
});

// Reject product
router.patch('/:id/reject', adminAuth, async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const product = await SellerProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.status = 'rejected';
    product.reviewedBy = req.admin._id;
    product.reviewedAt = new Date();
    product.rejectionReason = reason;

    await product.save();

    res.json({
      success: true,
      message: 'Product rejected',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting product',
      error: error.message
    });
  }
});

// Toggle featured status
router.patch('/:id/featured', adminAuth, async (req, res) => {
  try {
    const product = await SellerProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.featured = !product.featured;
    await product.save();

    res.json({
      success: true,
      message: `Product ${product.featured ? 'marked as featured' : 'removed from featured'}`,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// Delete product
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await SellerProduct.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

// Get stats
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const total = await SellerProduct.countDocuments();
    const pending = await SellerProduct.countDocuments({ status: 'pending' });
    const approved = await SellerProduct.countDocuments({ status: 'approved' });
    const rejected = await SellerProduct.countDocuments({ status: 'rejected' });
    const featured = await SellerProduct.countDocuments({ featured: true });

    res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
        featured
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
});

module.exports = router;
