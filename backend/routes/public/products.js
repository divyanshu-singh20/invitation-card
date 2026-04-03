const express = require('express');
const router = express.Router();
const SellerProduct = require('../../models/SellerProduct');

// Helper function to convert image URLs to full URLs
const getFullImageUrl = (imageUrl, baseUrl) => {
  if (!imageUrl) return 'https://via.placeholder.com/400x300?text=No+Image';
  if (imageUrl.startsWith('/uploads')) {
    return `${baseUrl}${imageUrl}`;
  }
  return imageUrl;
};

// Helper to transform product images
const transformProductImages = (product, baseUrl) => {
  if (product.images && Array.isArray(product.images)) {
    product.images = product.images.map(img => ({
      ...img.toObject ? img.toObject() : img,
      url: getFullImageUrl(img.url, baseUrl)
    }));
  }
  return product;
};

// Get all approved products (public)
router.get('/', async (req, res) => {
  try {
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5002}`;
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      page = 1, 
      limit = 20,
      sort = 'newest'
    } = req.query;
    
    let query = { 
      status: 'approved', 
      isActive: true 
    };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Price range
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.basePrice.$lte = parseFloat(maxPrice);
    }
    
    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    switch (sort) {
      case 'price-low':
        sortOption = { basePrice: 1 };
        break;
      case 'price-high':
        sortOption = { basePrice: -1 };
        break;
      case 'popular':
        sortOption = { views: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let products = await SellerProduct.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('seller', 'shopName ownerName')
      .select('-adminNotes')
      .lean();
    
    // Transform image URLs to full URLs
    products = products.map(p => transformProductImages(p, baseUrl));
    
    const total = await SellerProduct.countDocuments(query);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
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

// Get products grouped by category (for homepage)
router.get('/by-category', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5002}`;
    
    // Get all unique categories that have approved products
    const categories = await SellerProduct.distinct('category', { 
      status: 'approved', 
      isActive: true 
    });
    
    const result = {};
    
    for (const category of categories) {
      const products = await SellerProduct.find({ 
        category, 
        status: 'approved', 
        isActive: true 
      })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .populate('seller', 'shopName')
        .select('title slug basePrice images category views');
      
      if (products.length > 0) {
        result[category] = products.map(p => {
          // Convert relative URL to full URL
          let imageUrl = p.images?.[0]?.url || '';
          if (imageUrl && imageUrl.startsWith('/uploads')) {
            imageUrl = `${baseUrl}${imageUrl}`;
          } else if (!imageUrl) {
            imageUrl = 'https://via.placeholder.com/400x300?text=No+Image';
          }
          
          return {
            _id: p._id,
            id: p._id,
            name: p.title,
            title: p.title,
            slug: p.slug,
            price: p.basePrice,
            image: imageUrl,
            category: p.category,
            shopName: p.seller?.shopName,
            views: p.views
          };
        });
      }
    }
    
    res.json({
      success: true,
      data: result,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get single product by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5002}`;
    
    let product = await SellerProduct.findOne({ 
      slug: req.params.slug,
      status: 'approved',
      isActive: true
    })
      .populate('seller', 'shopName ownerName phone')
      .lean();
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Transform image URLs
    product = transformProductImages(product, baseUrl);
    
    // Increment views
    await SellerProduct.findByIdAndUpdate(product._id, { $inc: { views: 1 } });
    product.views = (product.views || 0) + 1;
    
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

// Get single product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5002}`;
    
    let product = await SellerProduct.findOne({ 
      _id: req.params.id,
      status: 'approved',
      isActive: true
    })
      .populate('seller', 'shopName ownerName phone')
      .lean();
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Transform image URLs
    product = transformProductImages(product, baseUrl);
    
    // Increment views
    await SellerProduct.findByIdAndUpdate(product._id, { $inc: { views: 1 } });
    product.views = (product.views || 0) + 1;
    
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

// Get related products
router.get('/:id/related', async (req, res) => {
  try {
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5002}`;
    const product = await SellerProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    let relatedProducts = await SellerProduct.find({
      _id: { $ne: product._id },
      category: product.category,
      status: 'approved',
      isActive: true
    })
      .limit(4)
      .select('title slug basePrice images')
      .lean();
    
    // Transform image URLs
    relatedProducts = relatedProducts.map(p => transformProductImages(p, baseUrl));
    
    res.json({
      success: true,
      data: relatedProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching related products',
      error: error.message
    });
  }
});

module.exports = router;
