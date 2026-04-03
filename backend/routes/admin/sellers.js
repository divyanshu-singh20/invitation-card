const express = require('express');
const router = express.Router();
const Seller = require('../../models/Seller');
const adminAuth = require('../../middleware/adminAuth');

// Get all sellers (with filters)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search
    if (search) {
      query.$or = [
        { ownerName: { $regex: search, $options: 'i' } },
        { shopName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const sellers = await Seller.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password');
    
    const total = await Seller.countDocuments(query);
    
    // Count by status
    const counts = {
      all: await Seller.countDocuments(),
      pending: await Seller.countDocuments({ status: 'pending' }),
      approved: await Seller.countDocuments({ status: 'approved' }),
      rejected: await Seller.countDocuments({ status: 'rejected' })
    };
    
    res.json({
      success: true,
      sellers,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      },
      counts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sellers'
    });
  }
});

// Get single seller details
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id)
      .select('-password')
      .populate('reviewedBy', 'name email');
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }
    
    res.json({
      success: true,
      seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching seller details'
    });
  }
});

// Approve seller
router.put('/:id/approve', adminAuth, async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }
    
    seller.status = 'approved';
    seller.reviewedBy = req.admin._id;
    seller.reviewedAt = new Date();
    seller.rejectionReason = '';
    
    await seller.save();
    
    // TODO: Send approval email to seller
    
    res.json({
      success: true,
      message: 'Seller approved successfully',
      seller: {
        id: seller._id,
        ownerName: seller.ownerName,
        shopName: seller.shopName,
        status: seller.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving seller'
    });
  }
});

// Reject seller
router.put('/:id/reject', adminAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const seller = await Seller.findById(req.params.id);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }
    
    seller.status = 'rejected';
    seller.reviewedBy = req.admin._id;
    seller.reviewedAt = new Date();
    seller.rejectionReason = reason || 'Application did not meet our requirements';
    
    await seller.save();
    
    // TODO: Send rejection email to seller
    
    res.json({
      success: true,
      message: 'Seller rejected',
      seller: {
        id: seller._id,
        ownerName: seller.ownerName,
        shopName: seller.shopName,
        status: seller.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting seller'
    });
  }
});

// Toggle seller active status
router.put('/:id/toggle-active', adminAuth, async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }
    
    seller.isActive = !seller.isActive;
    await seller.save();
    
    res.json({
      success: true,
      message: seller.isActive ? 'Seller activated' : 'Seller deactivated',
      isActive: seller.isActive
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating seller status'
    });
  }
});

// Delete seller
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Seller deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting seller'
    });
  }
});

module.exports = router;
