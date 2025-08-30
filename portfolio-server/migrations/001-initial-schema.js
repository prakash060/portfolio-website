'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create users table
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      street: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true
      },
      zipCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      country: {
        type: Sequelize.STRING,
        defaultValue: 'India'
      },
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        defaultValue: 'user'
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      emailVerificationToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emailVerificationExpires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      passwordResetToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      passwordResetExpires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      lastLogin: {
        type: Sequelize.DATE,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create foods table
    await queryInterface.createTable('foods', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      originalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      category: {
        type: Sequelize.ENUM('Pizza', 'Burger', 'Salad', 'Dessert', 'Beverage', 'Appetizer', 'Main Course', 'Fast Food'),
        defaultValue: 'Fast Food'
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false
      },
      images: {
        type: Sequelize.TEXT, // MSSQL doesn't support JSON, using TEXT instead
        defaultValue: '[]'
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0
      },
      numReviews: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      ingredients: {
        type: Sequelize.TEXT, // MSSQL doesn't support JSON, using TEXT instead
        defaultValue: '[]'
      },
      allergens: {
        type: Sequelize.TEXT, // MSSQL doesn't support JSON, using TEXT instead
        defaultValue: '[]'
      },
      calories: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      protein: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      carbohydrates: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      fat: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      fiber: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      sugar: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      preparationTime: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      isVegetarian: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isVegan: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isSpicy: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      spiceLevel: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      stockQuantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      tags: {
        type: Sequelize.TEXT, // MSSQL doesn't support JSON, using TEXT instead
        defaultValue: '[]'
      },
      featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      discount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      discountValidUntil: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create orders table
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      orderNumber: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      items: {
        type: Sequelize.TEXT, // MSSQL doesn't support JSON, using TEXT instead
        allowNull: false,
        defaultValue: '[]'
      },
      deliveryFullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deliveryPhone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deliveryStreet: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deliveryCity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deliveryState: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deliveryZipCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deliveryCountry: {
        type: Sequelize.STRING,
        defaultValue: 'India'
      },
      deliveryInstructions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      paymentMethod: {
        type: Sequelize.ENUM('upi', 'card', 'cash'),
        allowNull: false
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending'
      },
      transactionId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      paymentId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      paymentAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      paymentCurrency: {
        type: Sequelize.STRING,
        defaultValue: 'INR'
      },
      upiId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cardLast4: {
        type: Sequelize.STRING(4),
        allowNull: true
      },
      cardBrand: {
        type: Sequelize.STRING,
        allowNull: true
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      tax: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      deliveryFee: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'),
        defaultValue: 'pending'
      },
      estimatedDeliveryTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      actualDeliveryTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      preparationTime: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      deliveryTime: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isUrgent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      cancellationReason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      cancelledBy: {
        type: Sequelize.ENUM('user', 'restaurant', 'system'),
        allowNull: true
      },
      cancelledAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      refundAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      refundReason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      refundStatus: {
        type: Sequelize.ENUM('none', 'pending', 'processed', 'failed'),
        defaultValue: 'none'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create reviews table
    await queryInterface.createTable('reviews', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      foodId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'foods',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add indexes
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['role']);
    await queryInterface.addIndex('foods', ['category']);
    await queryInterface.addIndex('foods', ['isAvailable']);
    await queryInterface.addIndex('foods', ['featured']);
    await queryInterface.addIndex('orders', ['userId']);
    await queryInterface.addIndex('orders', ['orderNumber']);
    await queryInterface.addIndex('orders', ['status']);
    await queryInterface.addIndex('orders', ['paymentStatus']);
    await queryInterface.addIndex('reviews', ['userId', 'foodId'], { unique: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reviews');
    await queryInterface.dropTable('orders');
    await queryInterface.dropTable('foods');
    await queryInterface.dropTable('users');
  }
};
