const Review = require('../models/Review');
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for review image uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/reviews');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'review-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'));
    }
  }
}).array('images', 5); // Allow up to 5 images

// Check if user can review an order
exports.canReview = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order is delivered
    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'You can only review delivered orders',
        canReview: false
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ order: orderId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this order',
        canReview: false
      });
    }

    res.status(200).json({
      success: true,
      canReview: true,
      order: {
        orderId: order.orderId,
        productInfo: order.productInfo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    try {
      const { orderId, rating, comment, guestName, guestMobile } = req.body;

      // Validate required fields
      if (!orderId || !rating || !comment || !guestName || !guestMobile) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      // Find the order
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Check if order is delivered
      if (order.orderStatus !== 'delivered') {
        return res.status(400).json({
          success: false,
          message: 'You can only review delivered orders'
        });
      }

      // Check if already reviewed
      const existingReview = await Review.findOne({ order: orderId });
      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this order'
        });
      }

      // Process uploaded images
      const images = req.files ? req.files.map(file => ({
        url: `/uploads/reviews/${file.filename}`,
        publicId: file.filename
      })) : [];

      // Get product slug from order
      const productSlug = order.productInfo?.slug || order.product?.slug || 'unknown';

      // Create review
      const review = new Review({
        product: order.product,
        productSlug: productSlug,
        order: orderId,
        user: order.user || null,
        guestName,
        guestMobile,
        rating: parseInt(rating),
        comment,
        images,
        isVerifiedPurchase: true
      });

      await review.save();

      res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: review
      });
    } catch (error) {
      // Clean up uploaded files on error
      if (req.files) {
        for (const file of req.files) {
          try {
            await fs.unlink(file.path);
          } catch (unlinkError) {
            console.error('Error deleting file:', unlinkError);
          }
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create review',
        error: error.message
      });
    }
  });
};

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    const query = {
      productSlug: slug,
      status: 'approved'
    };

    if (rating) {
      query.rating = parseInt(rating);
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const count = await Review.countDocuments(query);

    // Calculate rating statistics
    const stats = await Review.aggregate([
      { $match: { productSlug: slug, status: 'approved' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          fiveStars: {
            $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] }
          },
          fourStars: {
            $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] }
          },
          threeStars: {
            $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] }
          },
          twoStars: {
            $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] }
          },
          oneStar: {
            $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalReviews: count,
        hasMore: page * limit < count
      },
      stats: stats[0] || {
        averageRating: 0,
        totalReviews: 0,
        fiveStars: 0,
        fourStars: 0,
        threeStars: 0,
        twoStars: 0,
        oneStar: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const { mobile } = req.query;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    const reviews = await Review.find({ guestMobile: mobile })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user reviews',
      error: error.message
    });
  }
};

// Mark review as helpful
exports.markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

module.exports = exports;
