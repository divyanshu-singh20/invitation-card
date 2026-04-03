const express = require('express');
const router = express.Router();
const SellerProduct = require('../../models/SellerProduct');
const { sellerAuth } = require('../../middleware/sellerAuth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/products';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 10 // Max 10 files
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg, .jpeg and .webp format allowed!'));
  }
});

// Get all products for logged in seller
router.get('/', sellerAuth, async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    
    let query = { seller: req.sellerId };
    
    if (status) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;
    
    const products = await SellerProduct.find(query)
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
router.get('/:id', sellerAuth, async (req, res) => {
  try {
    const product = await SellerProduct.findOne({
      _id: req.params.id,
      seller: req.sellerId
    });

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

// Create new product
router.post('/', sellerAuth, upload.array('images', 10), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subCategory,
      basePrice,
      pricePerHundred,
      discountPercent,
      paperOptions,
      colors,
      availableFonts,
      specifications,
      minOrderQuantity,
      deliveryDays,
      tags
    } = req.body;

    // Validate images
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Minimum 2 images are required'
      });
    }

    if (req.files.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 images are allowed'
      });
    }

    // Process images
    const images = req.files.map((file, index) => ({
      url: `/uploads/products/${file.filename}`,
      type: index === 0 ? 'front' : 'other',
      order: index
    }));

    // Parse JSON fields if they're strings
    const parsedPaperOptions = typeof paperOptions === 'string' ? JSON.parse(paperOptions) : paperOptions;
    const parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
    const parsedFonts = typeof availableFonts === 'string' ? JSON.parse(availableFonts) : availableFonts;
    const parsedSpecs = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

    const product = new SellerProduct({
      seller: req.sellerId,
      title,
      description,
      category,
      subCategory: subCategory || '',
      images,
      basePrice: parseFloat(basePrice),
      pricePerHundred: parseFloat(pricePerHundred),
      discountPercent: discountPercent ? parseFloat(discountPercent) : 0,
      paperOptions: parsedPaperOptions || [],
      colors: parsedColors || [],
      availableFonts: parsedFonts || [],
      specifications: parsedSpecs || {},
      minOrderQuantity: minOrderQuantity ? parseInt(minOrderQuantity) : 50,
      deliveryDays: deliveryDays ? parseInt(deliveryDays) : 7,
      tags: parsedTags || [],
      status: 'approved', // Automatically approved - no admin permission needed
      isActive: true  // Product is active
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
        });
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.name === 'ValidationError' ? error.message : 'Error creating product',
      error: error.message
    });
  }
});

// Update product
router.put('/:id', sellerAuth, upload.array('newImages', 10), async (req, res) => {
  try {
    const product = await SellerProduct.findOne({
      _id: req.params.id,
      seller: req.sellerId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const {
      title,
      description,
      category,
      subCategory,
      basePrice,
      pricePerHundred,
      discountPercent,
      paperOptions,
      colors,
      availableFonts,
      specifications,
      minOrderQuantity,
      deliveryDays,
      tags,
      existingImages, // Array of existing image URLs to keep
      inStock
    } = req.body;

    // Handle existing images
    let images = [];
    if (existingImages) {
      const keepImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
      images = product.images.filter(img => keepImages.includes(img.url));
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        type: 'other',
        order: images.length + index
      }));
      images = [...images, ...newImages];
    }

    // Validate total images
    if (images.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Minimum 2 images are required'
      });
    }

    if (images.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 images are allowed'
      });
    }

    // Parse JSON fields
    const parsedPaperOptions = typeof paperOptions === 'string' ? JSON.parse(paperOptions) : paperOptions;
    const parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
    const parsedFonts = typeof availableFonts === 'string' ? JSON.parse(availableFonts) : availableFonts;
    const parsedSpecs = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

    // Update fields
    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.subCategory = subCategory !== undefined ? subCategory : product.subCategory;
    product.images = images;
    product.basePrice = basePrice ? parseFloat(basePrice) : product.basePrice;
    product.pricePerHundred = pricePerHundred ? parseFloat(pricePerHundred) : product.pricePerHundred;
    product.discountPercent = discountPercent !== undefined ? parseFloat(discountPercent) : product.discountPercent;
    product.paperOptions = parsedPaperOptions || product.paperOptions;
    product.colors = parsedColors || product.colors;
    product.availableFonts = parsedFonts || product.availableFonts;
    product.specifications = parsedSpecs || product.specifications;
    product.minOrderQuantity = minOrderQuantity ? parseInt(minOrderQuantity) : product.minOrderQuantity;
    product.deliveryDays = deliveryDays ? parseInt(deliveryDays) : product.deliveryDays;
    product.tags = parsedTags || product.tags;
    product.inStock = inStock !== undefined ? inStock : product.inStock;
    
    // Reset to pending if was rejected and being edited
    if (product.status === 'rejected') {
      product.status = 'pending';
      product.rejectionReason = '';
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
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
router.delete('/:id', sellerAuth, async (req, res) => {
  try {
    const product = await SellerProduct.findOne({
      _id: req.params.id,
      seller: req.sellerId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete associated images
    product.images.forEach(img => {
      const filePath = path.join(__dirname, '../../', img.url);
      fs.unlink(filePath, err => {
      });
    });

    await SellerProduct.findByIdAndDelete(req.params.id);

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

// Toggle product active status
router.patch('/:id/toggle-active', sellerAuth, async (req, res) => {
  try {
    const product = await SellerProduct.findOne({
      _id: req.params.id,
      seller: req.sellerId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({
      success: true,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling product status',
      error: error.message
    });
  }
});

// Get dashboard stats
router.get('/stats/dashboard', sellerAuth, async (req, res) => {
  try {
    const totalProducts = await SellerProduct.countDocuments({ seller: req.sellerId });
    const activeProducts = await SellerProduct.countDocuments({ seller: req.sellerId, status: 'approved', isActive: true });
    const pendingProducts = await SellerProduct.countDocuments({ seller: req.sellerId, status: 'pending' });
    const rejectedProducts = await SellerProduct.countDocuments({ seller: req.sellerId, status: 'rejected' });
    
    const products = await SellerProduct.find({ seller: req.sellerId });
    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalOrders = products.reduce((sum, p) => sum + (p.orders || 0), 0);

    res.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        pendingProducts,
        rejectedProducts,
        totalViews,
        totalOrders
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
