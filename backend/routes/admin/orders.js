const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const Customization = require('../../models/Customization');
const adminAuth = require('../../middleware/adminAuth');

// Apply admin auth to all routes
router.use(adminAuth);

// @route   GET /api/admin/orders
// @desc    Get all orders with filters
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      paymentType, 
      page = 1, 
      limit = 20,
      search 
    } = req.query;

    const query = {};

    // Apply filters
    if (status) query.status = status;
    if (paymentType) query.paymentType = paymentType;
    
    // Search by order ID or customer mobile
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'shippingAddress.mobile': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .populate('user', 'name mobile email')
      .populate('design', 'name images category')
      .populate('customization')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalOrders: count
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching orders' 
    });
  }
});

// @route   GET /api/admin/orders/:id
// @desc    Get single order details
// @access  Admin
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching order with ID:', req.params.id); // Debug log
    
    const order = await Order.findById(req.params.id)
      .populate('user', 'name mobile email')
      .populate({
        path: 'design',
        select: 'name images category'
      })
      .populate('customization');

    console.log('Order found:', order ? 'Yes' : 'No'); // Debug log
    if (order) {
      console.log('Order structure:', {
        hasUser: !!order.user,
        hasDesign: !!order.design,
        hasProductInfo: !!order.productInfo,
        hasCustomization: !!order.customization
      });
    }

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error); // Debug log
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching order details',
      error: error.message 
    });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Admin
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['received', 'designing', 'printing', 'dispatched', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('user', 'name mobile')
     .populate('design', 'name');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating order status' 
    });
  }
});

// @route   GET /api/admin/orders/:id/pdf
// @desc    Get order print PDF data
// @access  Admin
router.get('/:id/pdf', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('design')
      .populate('customization');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Return data needed for PDF generation
    res.json({
      success: true,
      printData: {
        orderId: order.orderId,
        design: order.design,
        customization: order.customization,
        quantity: order.quantity,
        paperType: order.paperType
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching PDF data' 
    });
  }
});

module.exports = router;
