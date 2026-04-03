const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const Payment = require('../../models/Payment');
const adminAuth = require('../../middleware/adminAuth');

// Apply admin auth to all routes
router.use(adminAuth);

// @route   GET /api/admin/dashboard/stats
// @desc    Get dashboard statistics
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Today's orders
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    // Total revenue (paid orders)
    const revenueData = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Pending prints (orders not yet dispatched)
    const pendingPrints = await Order.countDocuments({
      status: { $in: ['received', 'designing', 'printing'] }
    });

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name mobile')
      .populate('design', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderId status totalPrice createdAt');

    res.json({
      success: true,
      stats: {
        totalOrders,
        todayOrders,
        totalRevenue,
        pendingPrints,
        ordersByStatus,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard stats' 
    });
  }
});

// @route   GET /api/admin/dashboard/revenue
// @desc    Get revenue chart data
// @access  Admin
router.get('/revenue', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const revenueByDay = await Payment.aggregate([
      {
        $match: {
          status: 'paid',
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: revenueByDay
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching revenue data' 
    });
  }
});

// @route   GET /api/admin/dashboard/orders-chart
// @desc    Get orders chart data
// @access  Admin
router.get('/orders-chart', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const ordersByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: ordersByDay
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching orders chart data' 
    });
  }
});

module.exports = router;
