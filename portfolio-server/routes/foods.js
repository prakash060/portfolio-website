const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, optionalAuth } = require('../middleware/auth');
const Food = require('../models/Food');

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const {
    category,
    search,
    minPrice,
    maxPrice,
    isVegetarian,
    isSpicy,
    featured,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  let query = { isAvailable: true };

  // Category filter
  if (category) {
    query.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Dietary filters
  if (isVegetarian !== undefined) {
    query.isVegetarian = isVegetarian === 'true';
  }

  if (isSpicy !== undefined) {
    query.isSpicy = isSpicy === 'true';
  }

  // Featured filter
  if (featured !== undefined) {
    query.featured = featured === 'true';
  }

  // Text search
  if (search) {
    query.$text = { $search: search };
  }

  // Sorting
  let sortOptions = {};
  if (sortBy === 'price') {
    sortOptions.price = sortOrder === 'desc' ? -1 : 1;
  } else if (sortBy === 'rating') {
    sortOptions.rating = sortOrder === 'desc' ? -1 : 1;
  } else if (sortBy === 'name') {
    sortOptions.name = sortOrder === 'desc' ? -1 : 1;
  } else {
    sortOptions.createdAt = sortOrder === 'desc' ? -1 : 1;
  }

  const foods = await Food.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await Food.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      foods,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get food by ID
// @route   GET /api/foods/:id
// @access  Public
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);

  if (!food) {
    return res.status(404).json({
      success: false,
      message: 'Food item not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      food
    }
  });
}));

// @desc    Get food categories
// @route   GET /api/foods/categories/list
// @access  Public
router.get('/categories/list', asyncHandler(async (req, res) => {
  const categories = await Food.distinct('category');
  
  const categoryStats = await Promise.all(
    categories.map(async (category) => {
      const count = await Food.countDocuments({ 
        category, 
        isAvailable: true 
      });
      return { category, count };
    })
  );

  res.status(200).json({
    success: true,
    data: {
      categories: categoryStats
    }
  });
}));

// @desc    Get featured foods
// @route   GET /api/foods/featured/list
// @access  Public
router.get('/featured/list', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  
  const featuredFoods = await Food.findFeatured()
    .limit(limit)
    .sort({ rating: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      foods: featuredFoods
    }
  });
}));

// @desc    Get foods on sale
// @route   GET /api/foods/sale/list
// @access  Public
router.get('/sale/list', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  
  const saleFoods = await Food.findOnSale()
    .limit(limit)
    .sort({ discount: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      foods: saleFoods
    }
  });
}));

// @desc    Search foods
// @route   GET /api/foods/search/query
// @access  Public
router.get('/search/query', asyncHandler(async (req, res) => {
  const { q: query, limit = 10 } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const foods = await Food.search(query).limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: {
      foods,
      query,
      total: foods.length
    }
  });
}));

// @desc    Add review to food
// @route   POST /api/foods/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({
      success: false,
      message: 'Rating and comment are required'
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    });
  }

  const food = await Food.findById(req.params.id);
  if (!food) {
    return res.status(404).json({
      success: false,
      message: 'Food item not found'
    });
  }

  // Add review
  await food.addReview(req.user.id, req.user.name, rating, comment);

  res.status(201).json({
    success: true,
    message: 'Review added successfully',
    data: {
      food
    }
  });
}));

// @desc    Get food reviews
// @route   GET /api/foods/:id/reviews
// @access  Public
router.get('/:id/reviews', asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id).select('reviews rating numReviews');

  if (!food) {
    return res.status(404).json({
      success: false,
      message: 'Food item not found'
    });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const reviews = food.reviews.slice(skip, skip + limit);
  const total = food.reviews.length;

  res.status(200).json({
    success: true,
    data: {
      reviews,
      rating: food.rating,
      numReviews: food.numReviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get food statistics (Admin only)
// @route   GET /api/foods/stats/overview
// @access  Private/Admin
router.get('/stats/overview', protect, asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }

  const totalFoods = await Food.countDocuments();
  const availableFoods = await Food.countDocuments({ isAvailable: true });
  const unavailableFoods = await Food.countDocuments({ isAvailable: false });
  const featuredFoods = await Food.countDocuments({ featured: true });
  const saleFoods = await Food.countDocuments({ discount: { $gt: 0 } });

  // Category distribution
  const categoryStats = await Food.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Average rating
  const avgRating = await Food.aggregate([
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalFoods,
      availableFoods,
      unavailableFoods,
      featuredFoods,
      saleFoods,
      categoryDistribution: categoryStats,
      averageRating: avgRating[0]?.avgRating || 0
    }
  });
}));

// @desc    Create new food (Admin only)
// @route   POST /api/foods
// @access  Private/Admin
router.post('/', protect, asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }

  const food = await Food.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Food item created successfully',
    data: {
      food
    }
  });
}));

// @desc    Update food (Admin only)
// @route   PUT /api/foods/:id
// @access  Private/Admin
router.put('/:id', protect, asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }

  const food = await Food.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!food) {
    return res.status(404).json({
      success: false,
      message: 'Food item not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Food item updated successfully',
    data: {
      food
    }
  });
}));

// @desc    Delete food (Admin only)
// @route   DELETE /api/foods/:id
// @access  Private/Admin
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }

  const food = await Food.findById(req.params.id);

  if (!food) {
    return res.status(404).json({
      success: false,
      message: 'Food item not found'
    });
  }

  await food.remove();

  res.status(200).json({
    success: true,
    message: 'Food item deleted successfully'
  });
}));

module.exports = router;
