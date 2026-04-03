const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const SellerProduct = require('../../models/SellerProduct');
const { sellerAuth } = require('../../middleware/sellerAuth');

// Get orders for seller's products
router.get('/', sellerAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Get seller's product IDs
    const sellerProducts = await SellerProduct.find({ seller: req.sellerId }).select('_id');
    const productIds = sellerProducts.map(p => p._id.toString());

    console.log('🔍 Seller products:', productIds);

    // Match orders where productInfo.id or product field matches seller's products
    let query = {
      $or: [
        { 'productInfo.id': { $in: productIds } },
        { product: { $in: productIds } }
      ]
    };
    
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email phone');

    console.log('📦 Found orders:', orders.length);
    
    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Get single order
router.get('/:id', sellerAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// Update order status (limited actions for seller)
router.patch('/:id/status', sellerAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const allowedStatuses = ['confirmed', 'printing', 'shipped', 'delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
});

// Get order stats
router.get('/stats/summary', sellerAuth, async (req, res) => {
  try {
    const sellerProducts = await SellerProduct.find({ seller: req.sellerId }).select('_id');
    const productIds = sellerProducts.map(p => p._id);

    const query = { 'items.productId': { $in: productIds } };

    const totalOrders = await Order.countDocuments(query);
    const pendingOrders = await Order.countDocuments({ ...query, status: 'pending' });
    const processingOrders = await Order.countDocuments({ ...query, status: 'processing' });
    const completedOrders = await Order.countDocuments({ ...query, status: 'delivered' });

    // Calculate revenue
    const orders = await Order.find({ ...query, status: { $in: ['delivered', 'shipped', 'processing'] } });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        totalRevenue
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
