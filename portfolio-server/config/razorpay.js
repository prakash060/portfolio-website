const Razorpay = require('razorpay');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Razorpay configuration
const RAZORPAY_CONFIG = {
  key: process.env.RAZORPAY_KEY_ID,
  secret: process.env.RAZORPAY_KEY_SECRET,
  webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET,
  currency: 'INR',
  company_name: 'FoodHub',
  company_description: 'Delicious food delivered to your doorstep',
  theme_color: '#2E7D32',
  payment_methods: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true,
    emi: false
  }
};

// Create order options
const createOrderOptions = (amount, receipt, notes = {}) => ({
  amount: Math.round(amount * 100), // Convert to paise
  currency: RAZORPAY_CONFIG.currency,
  receipt: receipt,
  payment_capture: 1,
  notes: notes
});

// Verify payment signature
const verifyPaymentSignature = (orderId, paymentId, signature) => {
  try {
    const text = orderId + '|' + paymentId;
    const generated_signature = require('crypto')
      .createHmac('sha256', RAZORPAY_CONFIG.secret)
      .update(text)
      .digest('hex');
    
    return generated_signature === signature;
  } catch (error) {
    console.error('Payment signature verification error:', error);
    return false;
  }
};

// Verify webhook signature
const verifyWebhookSignature = (payload, signature) => {
  try {
    const generated_signature = require('crypto')
      .createHmac('sha256', RAZORPAY_CONFIG.webhook_secret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return generated_signature === signature;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
};

module.exports = {
  razorpay,
  RAZORPAY_CONFIG,
  createOrderOptions,
  verifyPaymentSignature,
  verifyWebhookSignature
};
