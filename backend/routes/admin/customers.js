const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Order = require('../../models/Order');
const adminAuth = require('../../middleware/adminAuth');

// Apply admin auth to all routes
router.use(adminAuth);

// @route   GET /api/admin/customers
// @desc    Get all customers
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const query = {};
    
    // Search by name or mobile
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get order count and total spend for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ user: customer._id });
        const totalOrders = orders.length;
        const totalSpend = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const lastOrder = orders.length > 0 ? orders[0].createdAt : null;

        return {
          ...customer.toObject(),
          totalOrders,
          totalSpend,
          lastOrderDate: lastOrder
        };
      })
    );

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      customers: customersWithStats,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalCustomers: count
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching customers' 
    });
  }
});

// @route   GET /api/admin/customers/:id
// @desc    Get customer details
// @access  Admin
router.get('/:id', async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');

    if (!customer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Customer not found' 
      });
    }

    // Get customer's order history
    const orders = await Order.find({ user: customer._id })
      .populate('design', 'name images')
      .sort({ createdAt: -1 });

    const totalOrders = orders.length;
    const totalSpend = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.json({
      success: true,
      customer: {
        ...customer.toObject(),
        totalOrders,
        totalSpend
      },
      orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching customer details' 
    });
  }
});

// @route   GET /api/admin/customers/:id/orders
// @desc    Get customer's order history
// @access  Admin
router.get('/:id/orders', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id })
      .populate('design', 'name images category')
      .populate('customization')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching customer orders' 
    });
  }
});

module.exports = router;
