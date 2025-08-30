const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a food name'],
    trim: true,
    maxlength: [100, 'Food name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Pizza', 'Burger', 'Salad', 'Dessert', 'Beverage', 'Appetizer', 'Main Course', 'Fast Food'],
    default: 'Fast Food'
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    enum: ['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Fish', 'Shellfish', 'Wheat'],
    trim: true
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number,
    fiber: Number,
    sugar: Number
  },
  preparationTime: {
    type: Number, // in minutes
    min: [0, 'Preparation time cannot be negative']
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isSpicy: {
    type: Boolean,
    default: false
  },
  spiceLevel: {
    type: Number,
    min: [0, 'Spice level cannot be negative'],
    max: [5, 'Spice level cannot be more than 5'],
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot be more than 100%'],
    default: 0
  },
  discountValidUntil: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discounted price
foodSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0 && this.discount <= 100) {
    return Math.round((this.price * (100 - this.discount)) / 100);
  }
  return this.price;
});

// Virtual for isOnSale
foodSchema.virtual('isOnSale').get(function() {
  return this.discount > 0 && 
         (!this.discountValidUntil || this.discountValidUntil > new Date());
});

// Indexes for better query performance
foodSchema.index({ name: 'text', description: 'text' });
foodSchema.index({ category: 1 });
foodSchema.index({ price: 1 });
foodSchema.index({ rating: -1 });
foodSchema.index({ isAvailable: 1 });
foodSchema.index({ featured: 1 });
foodSchema.index({ isVegetarian: 1 });
foodSchema.index({ isSpicy: 1 });

// Pre-save middleware to set original price if not set
foodSchema.pre('save', function(next) {
  if (!this.originalPrice) {
    this.originalPrice = this.price;
  }
  next();
});

// Static method to find available foods
foodSchema.statics.findAvailable = function() {
  return this.find({ isAvailable: true, stockQuantity: { $gt: 0 } });
};

// Static method to find foods by category
foodSchema.statics.findByCategory = function(category) {
  return this.find({ category, isAvailable: true });
};

// Static method to find featured foods
foodSchema.statics.findFeatured = function() {
  return this.find({ featured: true, isAvailable: true });
};

// Static method to find foods on sale
foodSchema.statics.findOnSale = function() {
  const now = new Date();
  return this.find({
    discount: { $gt: 0 },
    $or: [
      { discountValidUntil: { $exists: false } },
      { discountValidUntil: { $gt: now } }
    ],
    isAvailable: true
  });
};

// Static method to search foods
foodSchema.statics.search = function(query) {
  return this.find({
    $text: { $search: query },
    isAvailable: true
  }).sort({ score: { $meta: 'textScore' } });
};

// Instance method to add review
foodSchema.methods.addReview = function(userId, userName, rating, comment) {
  // Check if user already reviewed
  const existingReviewIndex = this.reviews.findIndex(
    review => review.user.toString() === userId.toString()
  );

  if (existingReviewIndex > -1) {
    // Update existing review
    this.reviews[existingReviewIndex].rating = rating;
    this.reviews[existingReviewIndex].comment = comment;
    this.reviews[existingReviewIndex].createdAt = new Date();
  } else {
    // Add new review
    this.reviews.push({
      user: userId,
      name: userName,
      rating,
      comment
    });
  }

  // Recalculate average rating
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = totalRating / this.reviews.length;
  this.numReviews = this.reviews.length;

  return this.save();
};

// Instance method to update stock
foodSchema.methods.updateStock = function(quantity) {
  this.stockQuantity = Math.max(0, this.stockQuantity + quantity);
  this.isAvailable = this.stockQuantity > 0;
  return this.save();
};

module.exports = mongoose.model('Food', foodSchema);
