const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [{
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    total: {
      type: Number,
      required: true
    },
    image: String,
    specialInstructions: String
  }],
  deliveryDetails: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        default: 'India'
      }
    },
    deliveryInstructions: String
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['upi', 'card', 'cash'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentId: String,
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    upiId: String,
    cardLast4: String,
    cardBrand: String
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  preparationTime: {
    type: Number, // in minutes
    default: 0
  },
  deliveryTime: {
    type: Number, // in minutes
    default: 0
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  notes: String,
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['user', 'restaurant', 'system']
  },
  cancelledAt: Date,
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: String,
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'processed', 'failed'],
    default: 'none'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for order status display
orderSchema.virtual('statusDisplay').get(function() {
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
});

// Virtual for delivery address
orderSchema.virtual('deliveryAddress').get(function() {
  const addr = this.deliveryDetails.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  return Date.now() - this.createdAt;
});

// Virtual for isDelayed
orderSchema.virtual('isDelayed').get(function() {
  if (!this.estimatedDeliveryTime) return false;
  return Date.now() > this.estimatedDeliveryTime && this.status !== 'delivered';
});

// Indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'paymentDetails.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ estimatedDeliveryTime: 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  
  // Calculate totals if not set
  if (!this.pricing.subtotal) {
    this.pricing.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  }
  
  if (!this.pricing.total) {
    this.pricing.total = this.pricing.subtotal + this.pricing.tax + this.pricing.deliveryFee - this.pricing.discount;
  }
  
  next();
});

// Static method to find orders by user
orderSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Static method to find pending payment orders
orderSchema.statics.findPendingPayment = function() {
  return this.find({ 'paymentDetails.status': 'pending' });
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to find delayed orders
orderSchema.statics.findDelayed = function() {
  return this.find({
    estimatedDeliveryTime: { $lt: new Date() },
    status: { $nin: ['delivered', 'cancelled'] }
  });
};

// Instance method to update status
orderSchema.methods.updateStatus = function(newStatus, notes = '') {
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
  
  return this.save();
};

// Instance method to cancel order
orderSchema.methods.cancelOrder = function(reason, cancelledBy) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledBy = cancelledBy;
  this.cancelledAt = Date.now();
  
  // If payment was completed, initiate refund
  if (this.paymentDetails.status === 'completed') {
    this.refundStatus = 'pending';
    this.refundAmount = this.pricing.total;
    this.refundReason = 'Order cancelled';
  }
  
  return this.save();
};

// Instance method to process refund
orderSchema.methods.processRefund = function(status, reason = '') {
  this.refundStatus = status;
  if (reason) this.refundReason = reason;
  
  if (status === 'processed') {
    this.paymentDetails.status = 'refunded';
  }
  
  return this.save();
};

// Instance method to calculate delivery time
orderSchema.methods.calculateDeliveryTime = function() {
  const now = new Date();
  const totalTime = (this.preparationTime || 0) + (this.deliveryTime || 0);
  this.estimatedDeliveryTime = new Date(now.getTime() + totalTime * 60000);
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
