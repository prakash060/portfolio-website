const { getSequelize } = require('../config/database');
const User = require('./User');
const Food = require('./Food');
const Order = require('./Order');
const Review = require('./Review');

const sequelize = getSequelize();

// Define associations
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders'
});

Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Review, {
  foreignKey: 'userId',
  as: 'reviews'
});

Review.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Food.hasMany(Review, {
  foreignKey: 'foodId',
  as: 'reviews'
});

Review.belongsTo(Food, {
  foreignKey: 'foodId',
  as: 'food'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Food,
  Order,
  Review
};
