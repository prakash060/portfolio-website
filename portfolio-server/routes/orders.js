const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, admin } = require('../middleware/auth');
const Order = require('../models/Order');
const Food = require('../models/Food');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const {
    items,
    deliveryDetails,
    paymentDetails,
    pricing,
    specialInstructions
  } = req.body;

  if (!items || !deliveryDetails || !paymentDetails || !pricing) {
    return res.status(400).json({
      success: false,
      message: 'Missing required order details'
    });
  }

  // Validate items and check stock
  for (const item of items) {
    const food = await Food.findById(item.food);
    if (!food) {
      return res.status(400).json({
        success: false,
        message: `Food item ${item.name} not found`
      });
    }
    if (!food.isAvailable) {
      return res.status(400).json({
        success: false,
        message: `Food item ${item.name} is not available`
      });
    }
    if (food.stockQuantity < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${item.name}`
      });
    }
  }

  // Create order
  const order = await Order.create({
    user: req.user.id,
    items,
    deliveryDetails,
    paymentDetails,
    pricing,
    notes: specialInstructions
  });

  // Update stock quantities
  for (const item of items) {
    await Food.findByIdAndUpdate(item.food, {
      $inc: { stockQuantity: -item.quantity }
    });
  }

  // Populate user details
  await order.populate('user', 'name email');

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: {
      order
    }
  });
}));

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
router.get('/my-orders', protect, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { status, paymentStatus } = req.query;
  let query = { user: req.user.id };

  if (status) query.status = status;
  if (paymentStatus) query['paymentDetails.status'] = paymentStatus;

  const orders = await Order.find(query)
    .populate('items.food', 'name image')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('items.food', 'name image description');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Users can only view their own orders unless they're admin
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      order
    }
  });
}));

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required'
    });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Update status
  await order.updateStatus(status, notes);

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: {
      order
    }
  });
}));

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Users can only cancel their own orders unless they're admin
  if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Check if order can be cancelled
  if (['delivered', 'cancelled'].includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: 'Order cannot be cancelled'
    });
  }

  // Cancel order
  await order.cancelOrder(reason, req.user.role === 'admin' ? 'restaurant' : 'user');

  // Restore stock quantities
  for (const item of order.items) {
    await Food.findByIdAndUpdate(item.food, {
      $inc: { stockQuantity: item.quantity }
    });
  }

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: {
      order
    }
  });
}));

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { status, paymentStatus, userId, startDate, endDate } = req.query;
  let query = {};

  if (status) query.status = status;
  if (paymentStatus) query['paymentDetails.status'] = paymentStatus;
  if (userId) query.user = userId;

  // Date range filter
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/stats/overview
// @access  Private/Admin
router.get('/stats/overview', protect, admin, asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
  const preparingOrders = await Order.countDocuments({ status: 'preparing' });
  const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
  const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

  // Payment statistics
  const pendingPayments = await Order.countDocuments({ 'paymentDetails.status': 'pending' });
  const completedPayments = await Order.countDocuments({ 'paymentDetails.status': 'completed' });
  const failedPayments = await Order.countDocuments({ 'paymentDetails.status': 'failed' });

  // Revenue statistics
  const revenueStats = await Order.aggregate([
    { $match: { 'paymentDetails.status': 'completed' } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$pricing.total' },
        avgOrderValue: { $avg: '$pricing.total' },
        totalOrders: { $sum: 1 }
      }
    }
  ]);

  // Recent orders (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentOrders = await Order.countDocuments({
    createdAt: { $gte: sevenDaysAgo }
  });

  res.status(200).json({
    success: true,
    data: {
      orderStats: {
        total: totalOrders,
        pending: pendingOrders,
        confirmed: confirmedOrders,
        preparing: preparingOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      },
      paymentStats: {
        pending: pendingPayments,
        completed: completedPayments,
        failed: failedPayments
      },
      revenueStats: revenueStats[0] || {
        totalRevenue: 0,
        avgOrderValue: 0,
        totalOrders: 0
      },
      recentOrders: {
        period: '7 days',
        count: recentOrders
      }
    }
  });
}));

// @desc    Get pending payment orders
// @route   GET /api/orders/pending-payments
// @access  Private/Admin
router.get('/pending-payments', protect, admin, asyncHandler(async (req, res) => {
  const orders = await Order.find({ 'paymentDetails.status': 'pending' })
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      orders
    }
  });
}));

// @desc    Get delayed orders
// @route   GET /api/orders/delayed
// @access  Private/Admin
router.get('/delayed', protect, admin, asyncHandler(async (req, res) => {
  const orders = await Order.find({
    estimatedDeliveryTime: { $lt: new Date() },
    status: { $nin: ['delivered', 'cancelled'] }
  })
    .populate('user', 'name email phone')
    .sort({ estimatedDeliveryTime: 1 });

  res.status(200).json({
    success: true,
    data: {
      orders
    }
  });
}));

// @desc    Process refund (Admin only)
// @route   PUT /api/orders/:id/refund
// @access  Private/Admin
router.put('/:id/refund', protect, admin, asyncHandler(async (req, res) => {
  const { status, reason } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Refund status is required'
    });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Process refund
  await order.processRefund(status, reason);

  res.status(200).json({
    success: true,
    message: 'Refund processed successfully',
    data: {
      order
    }
  });
}));

// @desc    Calculate delivery time
// @route   POST /api/orders/:id/calculate-delivery
// @access  Private/Admin
router.post('/:id/calculate-delivery', protect, admin, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Calculate delivery time
  await order.calculateDeliveryTime();

  res.status(200).json({
    success: true,
    message: 'Delivery time calculated successfully',
    data: {
      order
    }
  });
}));

module.exports = router;
