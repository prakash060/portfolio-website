const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { protect } = require('../middleware/auth');
const { 
  razorpay, 
  createOrderOptions, 
  verifyPaymentSignature, 
  verifyWebhookSignature 
} = require('../config/razorpay');
const Order = require('../models/Order');

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
router.post('/create-order', protect, asyncHandler(async (req, res) => {
  const { amount, currency = 'INR', receipt, notes = {} } = req.body;

  if (!amount || !receipt) {
    return res.status(400).json({
      success: false,
      message: 'Amount and receipt are required'
    });
  }

  try {
    // Create order options
    const orderOptions = createOrderOptions(amount, receipt, {
      ...notes,
      user_id: req.user.id
    });

    // Create order on Razorpay
    const razorpayOrder = await razorpay.orders.create(orderOptions);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: razorpayOrder,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
}));

// @desc    Verify payment signature
// @route   POST /api/payments/verify
// @access  Private
router.post('/verify', protect, asyncHandler(async (req, res) => {
  const { orderId, paymentId, signature, orderDbId } = req.body;

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({
      success: false,
      message: 'Order ID, payment ID, and signature are required'
    });
  }

  try {
    // Verify payment signature
    const isValid = verifyPaymentSignature(orderId, paymentId, signature);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update order in database if orderDbId is provided
    if (orderDbId) {
      const order = await Order.findById(orderDbId);
      if (order) {
        order.paymentDetails.status = 'completed';
        order.paymentDetails.paymentId = paymentId;
        order.paymentDetails.transactionId = orderId;
        order.status = 'confirmed';
        await order.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        verified: true,
        paymentId,
        orderId
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
}));

// @desc    Get payment status
// @route   GET /api/payments/status/:paymentId
// @access  Private
router.get('/status/:paymentId', protect, asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  try {
    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);

    res.status(200).json({
      success: true,
      data: {
        payment
      }
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
      error: error.message
    });
  }
}));

// @desc    Capture payment
// @route   POST /api/payments/capture/:paymentId
// @access  Private
router.post('/capture/:paymentId', protect, asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { amount, currency = 'INR' } = req.body;

  try {
    // Capture payment on Razorpay
    const payment = await razorpay.payments.capture(paymentId, amount * 100, currency);

    res.status(200).json({
      success: true,
      message: 'Payment captured successfully',
      data: {
        payment
      }
    });
  } catch (error) {
    console.error('Payment capture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to capture payment',
      error: error.message
    });
  }
}));

// @desc    Refund payment
// @route   POST /api/payments/refund/:paymentId
// @access  Private
router.post('/refund/:paymentId', protect, asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { amount, speed = 'normal', notes = {} } = req.body;

  try {
    // Process refund on Razorpay
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Convert to paise
      speed,
      notes: {
        ...notes,
        refunded_by: req.user.id,
        refunded_at: new Date().toISOString()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refund
      }
    });
  } catch (error) {
    console.error('Payment refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message
    });
  }
}));

// @desc    Razorpay webhook handler
// @route   POST /api/payments/webhook
// @access  Public
router.post('/webhook', asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const payload = req.body;

  if (!signature) {
    return res.status(400).json({
      success: false,
      message: 'Webhook signature missing'
    });
  }

  try {
    // Verify webhook signature
    const isValid = verifyWebhookSignature(payload, signature);

    if (!isValid) {
      console.error('Invalid webhook signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    // Process webhook event
    const event = payload.event;
    console.log(`Processing webhook event: ${event}`);

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(payload);
        break;
      
      case 'order.paid':
        await handleOrderPaid(payload);
        break;
      
      case 'order.payment_failed':
        await handleOrderPaymentFailed(payload);
        break;
      
      case 'refund.processed':
        await handleRefundProcessed(payload);
        break;
      
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    });
  }
}));

// Webhook event handlers
async function handlePaymentCaptured(payload) {
  try {
    const { payment } = payload.payload;
    console.log(`Payment captured: ${payment.id}`);
    
    // Update order status if needed
    // You can implement order status updates here
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
}

async function handlePaymentFailed(payload) {
  try {
    const { payment } = payload.payload;
    console.log(`Payment failed: ${payment.id}`);
    
    // Update order status to failed
    // You can implement order status updates here
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function handleOrderPaid(payload) {
  try {
    const { order } = payload.payload;
    console.log(`Order paid: ${order.id}`);
    
    // Update order status to confirmed
    // You can implement order status updates here
  } catch (error) {
    console.error('Error handling order paid:', error);
  }
}

async function handleOrderPaymentFailed(payload) {
  try {
    const { order } = payload.payload;
    console.log(`Order payment failed: ${order.id}`);
    
    // Update order status to failed
    // You can implement order status updates here
  } catch (error) {
    console.error('Error handling order payment failed:', error);
  }
}

async function handleRefundProcessed(payload) {
  try {
    const { refund } = payload.payload;
    console.log(`Refund processed: ${refund.id}`);
    
    // Update order refund status
    // You can implement refund status updates here
  } catch (error) {
    console.error('Error handling refund processed:', error);
  }
}

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Public
router.get('/methods', asyncHandler(async (req, res) => {
  const paymentMethods = {
    upi: {
      enabled: true,
      name: 'UPI',
      description: 'Pay using UPI apps like Google Pay, PhonePe, Paytm',
      icon: '💳'
    },
    card: {
      enabled: true,
      name: 'Credit/Debit Card',
      description: 'Pay using Visa, MasterCard, RuPay cards',
      icon: '💳'
    },
    netbanking: {
      enabled: true,
      name: 'Net Banking',
      description: 'Pay using your bank account',
      icon: '🏦'
    },
    wallet: {
      enabled: true,
      name: 'Digital Wallet',
      description: 'Pay using Paytm, PhonePe, Amazon Pay',
      icon: '📱'
    },
    cash: {
      enabled: true,
      name: 'Cash on Delivery',
      description: 'Pay when your food arrives',
      icon: '💰'
    }
  };

  res.status(200).json({
    success: true,
    data: {
      paymentMethods
    }
  });
}));

module.exports = router;
