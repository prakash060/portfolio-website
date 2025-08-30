const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/database');

const sequelize = getSequelize();

const Food = sequelize.define('Food', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 500]
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  category: {
    type: DataTypes.ENUM('Pizza', 'Burger', 'Salad', 'Dessert', 'Beverage', 'Appetizer', 'Main Course', 'Fast Food'),
    defaultValue: 'Fast Food'
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  images: {
    type: DataTypes.TEXT, // MSSQL doesn't support JSON, using TEXT instead
    defaultValue: '[]'
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  numReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ingredients: {
    type: DataTypes.TEXT, // MSSQL doesn't support JSON, using TEXT instead
    defaultValue: '[]'
  },
  allergens: {
    type: DataTypes.TEXT, // MSSQL doesn't support JSON, using TEXT instead
    defaultValue: '[]'
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  protein: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  carbohydrates: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  fat: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  fiber: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  sugar: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  preparationTime: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0
    }
  },
  isVegetarian: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVegan: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isSpicy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  spiceLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  tags: {
    type: DataTypes.TEXT, // MSSQL doesn't support JSON, using TEXT instead
    defaultValue: '[]'
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  discountValidUntil: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'foods',
  timestamps: true,
  hooks: {
    beforeSave: (food) => {
      if (!food.originalPrice) {
        food.originalPrice = food.price;
      }
    }
  }
});

// Instance methods
Food.prototype.getDiscountedPrice = function() {
  if (this.discount > 0 && this.discount <= 100) {
    return Math.round((this.price * (100 - this.discount)) / 100);
  }
  return this.price;
};

Food.prototype.isOnSale = function() {
  return this.discount > 0 && 
         (!this.discountValidUntil || this.discountValidUntil > new Date());
};

Food.prototype.addReview = async function(userId, userName, rating, comment) {
  // This would need to be implemented with a separate Review model
  // For now, we'll update the rating and review count
  const newNumReviews = this.numReviews + 1;
  const newRating = ((this.rating * this.numReviews) + rating) / newNumReviews;
  
  this.rating = newRating;
  this.numReviews = newNumReviews;
  
  return await this.save();
};

// Helper methods to parse JSON strings
Food.prototype.getImages = function() {
  try {
    return JSON.parse(this.images || '[]');
  } catch {
    return [];
  }
};

Food.prototype.getIngredients = function() {
  try {
    return JSON.parse(this.ingredients || '[]');
  } catch {
    return [];
  }
};

Food.prototype.getAllergens = function() {
  try {
    return JSON.parse(this.allergens || '[]');
  } catch {
    return [];
  }
};

Food.prototype.getTags = function() {
  try {
    return JSON.parse(this.tags || '[]');
  } catch {
    return [];
  }
};

Food.prototype.updateStock = async function(quantity) {
  this.stockQuantity = Math.max(0, this.stockQuantity + quantity);
  this.isAvailable = this.stockQuantity > 0;
  return await this.save();
};

// Static methods
Food.findAvailable = function() {
  return this.findAll({
    where: {
      isAvailable: true,
      stockQuantity: { [sequelize.Op.gt]: 0 }
    }
  });
};

Food.findByCategory = function(category) {
  return this.findAll({
    where: {
      category,
      isAvailable: true
    }
  });
};

Food.findFeatured = function() {
  return this.findAll({
    where: {
      featured: true,
      isAvailable: true
    }
  });
};

Food.findOnSale = function() {
  const now = new Date();
  return this.findAll({
    where: {
      discount: { [sequelize.Op.gt]: 0 },
      [sequelize.Op.or]: [
        { discountValidUntil: null },
        { discountValidUntil: { [sequelize.Op.gt]: now } }
      ],
      isAvailable: true
    }
  });
};

Food.search = function(query) {
  return this.findAll({
    where: {
      [sequelize.Op.or]: [
        { name: { [sequelize.Op.like]: `%${query}%` } },
        { description: { [sequelize.Op.like]: `%${query}%` } }
      ],
      isAvailable: true
    }
  });
};

module.exports = Food;
