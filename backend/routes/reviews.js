const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');

// Public routes
router.get('/product/:slug', ReviewController.getProductReviews);

// Review management
router.get('/can-review/:orderId', ReviewController.canReview);
router.post('/', ReviewController.createReview);
router.get('/user', ReviewController.getUserReviews);
router.post('/:reviewId/helpful', ReviewController.markHelpful);

module.exports = router;
