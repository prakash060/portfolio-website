const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/database');

const sequelize = getSequelize();

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  items: {
    type: DataTypes.TEXT, // MSSQL doesn't support JSON, using TEXT instead
    allowNull: false,
    defaultValue: '[]'
  },
  deliveryFullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deliveryPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deliveryStreet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deliveryCity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deliveryState: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deliveryZipCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deliveryCountry: {
    type: DataTypes.STRING,
    defaultValue: 'India'
  },
  deliveryInstructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('upi', 'card', 'cash'),
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentCurrency: {
    type: DataTypes.STRING,
    defaultValue: 'INR'
  },
  upiId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cardLast4: {
    type: DataTypes.STRING(4),
    allowNull: true
  },
  cardBrand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  deliveryFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  estimatedDeliveryTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actualDeliveryTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  preparationTime: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  deliveryTime: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isUrgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancelledBy: {
    type: DataTypes.ENUM('user', 'restaurant', 'system'),
    allowNull: true
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  refundReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  refundStatus: {
    type: DataTypes.ENUM('none', 'pending', 'processed', 'failed'),
    defaultValue: 'none'
  }
}, {
  tableName: 'orders',
  timestamps: true,
  hooks: {
    beforeSave: (order) => {
      if (!order.orderNumber) {
        order.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      }
      
      // Calculate totals if not set
      if (!order.subtotal && order.items) {
        try {
          const itemsArray = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
          if (Array.isArray(itemsArray) && itemsArray.length > 0) {
            order.subtotal = itemsArray.reduce((sum, item) => sum + (item.total || 0), 0);
          }
        } catch (error) {
          console.error('Error parsing items:', error);
          order.subtotal = 0;
        }
      }
      
      if (!order.total && order.subtotal) {
        order.total = order.subtotal + order.tax + order.deliveryFee - order.discount;
      }
    }
  }
});

// Helper methods to parse JSON strings
Order.prototype.getItems = function() {
  try {
    return JSON.parse(this.items || '[]');
  } catch {
    return [];
  }
};

// Instance methods
Order.prototype.getStatusDisplay = function() {
  const statusMap = {
    pending: 'Payment Pending',
    confirmed: 'Order Confirmed',
    preparing: 'Preparing Your Food',
    ready: 'Ready for Pickup',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  return statusMap[this.status] || this.status;
};

Order.prototype.getDeliveryAddress = function() {
  return `${this.deliveryStreet}, ${this.deliveryCity}, ${this.deliveryState} ${this.deliveryZipCode}`;
};

Order.prototype.getOrderAge = function() {
  return Date.now() - this.createdAt;
};

Order.prototype.isDelayed = function() {
  if (!this.estimatedDeliveryTime) return false;
  return Date.now() > this.estimatedDeliveryTime && this.status !== 'delivered';
};

Order.prototype.updateStatus = async function(newStatus, notes = '') {
  this.status = newStatus;
  if (notes) this.notes = notes;
  
  // Set timestamps for status changes
  if (newStatus === 'preparing') {
    this.preparationTime = Date.now();
  } else if (newStatus === 'out_for_delivery') {
    this.deliveryTime = Date.now();
  } else if (newStatus === 'delivered') {
    this.actualDeliveryTime = Date.now();
  }
  
  return await this.save();
};

Order.prototype.cancelOrder = async function(reason, cancelledBy) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledBy = cancelledBy;
  this.cancelledAt = Date.now();
  
  // If payment was completed, initiate refund
  if (this.paymentStatus === 'completed') {
    this.refundStatus = 'pending';
    this.refundAmount = this.total;
    this.refundReason = 'Order cancelled';
  }
  
  return await this.save();
};

Order.prototype.processRefund = async function(status, reason = '') {
  this.refundStatus = status;
  if (reason) this.refundReason = reason;
  
  if (status === 'processed') {
    this.paymentStatus = 'refunded';
  }
  
  return await this.save();
};

Order.prototype.calculateDeliveryTime = async function() {
  const now = new Date();
  const totalTime = (this.preparationTime || 0) + (this.deliveryTime || 0);
  this.estimatedDeliveryTime = new Date(now.getTime() + totalTime * 60000);
  return await this.save();
};

// Static methods
Order.findByUser = function(userId) {
  return this.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']]
  });
};

Order.findPendingPayment = function() {
  return this.findAll({
    where: { paymentStatus: 'pending' }
  });
};

Order.findByStatus = function(status) {
  return this.findAll({
    where: { status },
    order: [['createdAt', 'DESC']]
  });
};

Order.findDelayed = function() {
  return this.findAll({
    where: {
      estimatedDeliveryTime: { [sequelize.Op.lt]: new Date() },
      status: { [sequelize.Op.notIn]: ['delivered', 'cancelled'] }
    }
  });
};

module.exports = Order;
