const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;
    
    console.log('Received order data:', JSON.stringify(orderData, null, 2));
    
    // Validate required fields
    if (!orderData.quantity || orderData.quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required and must be at least 1'
      });
    }
    
    if (!orderData.pricePerCard || orderData.pricePerCard < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price per card is required'
      });
    }
    
    if (!orderData.shippingAddress || !orderData.shippingAddress.mobile) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address with mobile number is required'
      });
    }
    
    if (!orderData.paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required'
      });
    }
    
    // Calculate total
    const quantity = orderData.quantity;
    const pricePerCard = orderData.pricePerCard;
    const totalAmount = quantity * pricePerCard;
    
    orderData.totalAmount = totalAmount;
    orderData.quantity = quantity;
    orderData.pricePerCard = pricePerCard;
    
    // Set default paperType if not provided
    if (!orderData.paperType) {
      orderData.paperType = 'Standard';
    }
    
    // Add initial status
    orderData.statusHistory = [{
      status: 'ordered',
      timestamp: new Date(),
      note: 'Order placed successfully'
    }];
    
    // Calculate estimated delivery
    const deliveryDays = orderData.deliveryDays || 7;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays);
    orderData.estimatedDelivery = estimatedDelivery;
    
    const order = new Order(orderData);
    await order.save();
    
    console.log('Order saved:', order.orderId);
    
    // Populate design, product and customization
    await order.populate('design product customization');
    
    // Create Razorpay order for online payment
    let razorpayOrder = null;
    razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: order.orderId,
      notes: {
        orderId: order.orderId
      }
    });
    
    console.log('Razorpay order created:', razorpayOrder.id);
    
    // Create payment record (method will be updated after payment)
    const payment = new Payment({
      order: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount
    });
    await payment.save();
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order,
        razorpayOrder
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    console.error('Error stack:', error.stack);
    console.error('Validation errors:', error.errors);
    res.status(400).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : null
    });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId, paymentMethod } = req.body;
    
    const crypto = require('crypto');
    const sign = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');
    
    if (razorpaySignature === expectedSign) {
      // Fetch payment details from Razorpay
      let razorpayPaymentDetails = null;
      try {
        razorpayPaymentDetails = await razorpay.payments.fetch(razorpayPaymentId);
      } catch (err) {
        console.error('Error fetching payment details:', err);
      }
      
      // Update payment
      const payment = await Payment.findOne({ razorpayOrderId });
      if (payment) {
        payment.razorpayPaymentId = razorpayPaymentId;
        payment.razorpaySignature = razorpaySignature;
        payment.status = 'captured';
        // Set method from Razorpay response or request
        if (razorpayPaymentDetails && razorpayPaymentDetails.method) {
          payment.method = razorpayPaymentDetails.method;
        } else if (paymentMethod) {
          payment.method = paymentMethod;
        }
        await payment.save();
      }
      
      // Update order
      const order = await Order.findOne({ orderId });
      if (order) {
        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.statusHistory.push({
          status: 'confirmed',
          timestamp: new Date(),
          note: 'Payment verified successfully'
        });
        await order.save();
      }
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        order
      });
    } else {
      // Payment verification failed - mark as failed
      const payment = await Payment.findOne({ razorpayOrderId });
      if (payment) {
        payment.status = 'failed';
        await payment.save();
      }
      
      const order = await Order.findOne({ orderId });
      if (order) {
        order.paymentStatus = 'failed';
        order.statusHistory.push({
          status: 'ordered',
          timestamp: new Date(),
          note: 'Payment verification failed'
        });
        await order.save();
      }
      
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
});

// Handle payment failure
router.post('/payment-failed', async (req, res) => {
  try {
    const { orderId, errorCode, errorDescription } = req.body;
    
    const order = await Order.findOne({ orderId });
    if (order) {
      order.paymentStatus = 'failed';
      order.statusHistory.push({
        status: 'ordered',
        timestamp: new Date(),
        note: `Payment failed: ${errorDescription || errorCode}`
      });
      await order.save();
    }
    
    const payment = await Payment.findOne({ order: order._id }).sort({ createdAt: -1 });
    if (payment) {
      payment.status = 'failed';
      await payment.save();
    }
    
    res.json({
      success: true,
      message: 'Payment failure recorded'
    });
  } catch (error) {
    console.error('Error recording payment failure:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording payment failure',
      error: error.message
    });
  }
});

// Get order by ID or orderId
router.get('/:identifier', async (req, res) => {
  try {
    let order;
    
    // Check if it's MongoDB ObjectId or custom orderId
    if (req.params.identifier.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(req.params.identifier)
        .populate('design customization user');
    } else {
      order = await Order.findOne({ orderId: req.params.identifier })
        .populate('design customization user');
    }
    
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

// Track order by orderId or mobile
router.post('/track', async (req, res) => {
  try {
    const { orderId, mobile } = req.body;
    
    let query = {};
    if (orderId) {
      query.orderId = orderId;
    } else if (mobile) {
      query.$or = [
        { guestMobile: mobile },
        { 'shippingAddress.mobile': mobile }
      ];
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide orderId or mobile number'
      });
    }
    
    const orders = await Order.find(query)
      .populate('design')
      .sort({ createdAt: -1 });
    
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found'
      });
    }
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error tracking order',
      error: error.message
    });
  }
});

// Get user orders (requires auth middleware)
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('design customization')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Update order status (Admin only)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, note, trackingNumber } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    order.orderStatus = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`
    });
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    await order.save();
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

module.exports = router;
