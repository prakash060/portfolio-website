// Razorpay Configuration
// Replace these dummy values with your actual Razorpay credentials

export const RAZORPAY_CONFIG = {
  // Your Razorpay Key ID (public key)
  // Get this from your Razorpay Dashboard: https://dashboard.razorpay.com/app/keys
  key: 'rzp_test_YOUR_RAZORPAY_KEY_HERE',
  
  // Your Razorpay Key Secret (private key - keep this secure on backend)
  // This should NEVER be exposed in frontend code
  secret: 'YOUR_RAZORPAY_SECRET_HERE',
  
  // Environment (test/live)
  environment: 'test', // Change to 'live' for production
  
  // Company/Brand name
  companyName: 'FoodHub',
  
  // Company description
  companyDescription: 'Delicious food delivered to your doorstep',
  
  // Currency
  currency: 'INR',
  
  // Theme color (should match your app theme)
  themeColor: '#2E7D32',
  
  // Payment methods to enable
  paymentMethods: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true,
    emi: false
  },
  
  // UPI specific settings
  upi: {
    // Enable UPI intent
    intent: true,
    // Auto-fill UPI ID if available
    autoFill: true
  }
};

// Backend API endpoints (replace with your actual backend URLs)
export const API_ENDPOINTS = {
  // Create order on your backend
  createOrder: '/api/razorpay/create-order',
  
  // Verify payment signature
  verifyPayment: '/api/razorpay/verify-payment',
  
  // Get payment status
  paymentStatus: '/api/razorpay/payment-status',
  
  // Capture payment
  capturePayment: '/api/razorpay/capture-payment'
};

// Webhook configuration
export const WEBHOOK_CONFIG = {
  // Webhook secret for verifying webhook calls
  secret: 'YOUR_WEBHOOK_SECRET_HERE',
  
  // Webhook events to handle
  events: [
    'payment.captured',
    'payment.failed',
    'order.paid',
    'order.payment_failed'
  ]
};

// Error messages
export const ERROR_MESSAGES = {
  paymentFailed: 'Payment failed. Please try again.',
  paymentCancelled: 'Payment was cancelled by user.',
  verificationFailed: 'Payment verification failed. Please contact support.',
  networkError: 'Network error. Please check your connection and try again.',
  invalidAmount: 'Invalid payment amount.',
  orderNotFound: 'Order not found.',
  serverError: 'Server error. Please try again later.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  paymentSuccess: 'Payment successful! Your order has been confirmed.',
  orderCreated: 'Order created successfully. Please complete the payment.',
  paymentVerified: 'Payment verified successfully.'
};

export default RAZORPAY_CONFIG;
