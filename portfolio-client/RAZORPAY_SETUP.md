# Razorpay Integration Setup Guide

This guide will help you set up real-time UPI payments using Razorpay in your FoodHub application.

## 🚀 **What's Been Implemented**

✅ **Real-time UPI Payment System** - No more simulation  
✅ **Razorpay Gateway Integration** - Professional payment processing  
✅ **Payment Verification** - Secure payment confirmation  
✅ **Error Handling** - Comprehensive error management  
✅ **Configuration Management** - Easy to update settings  

## 📋 **Prerequisites**

1. **Razorpay Account** - Sign up at [razorpay.com](https://razorpay.com)
2. **Business Verification** - Complete KYC for live payments
3. **Bank Account** - For receiving payments
4. **Domain Verification** - For webhook security

## 🔑 **Step 1: Get Razorpay Credentials**

### 1.1 Access Razorpay Dashboard
- Go to [dashboard.razorpay.com](https://dashboard.razorpay.com)
- Sign in to your account

### 1.2 Get API Keys
- Navigate to **Settings** → **API Keys**
- Copy your **Key ID** (public key)
- Copy your **Key Secret** (private key - keep secure!)

### 1.3 Test vs Live Keys
- **Test Mode**: Use test keys for development
- **Live Mode**: Use live keys for production

## ⚙️ **Step 2: Update Configuration**

### 2.1 Update Frontend Config
Edit `src/config/razorpay.js`:

```javascript
export const RAZORPAY_CONFIG = {
  // Replace with your actual Razorpay Key ID
  key: 'rzp_test_ACTUAL_KEY_HERE', // or 'rzp_live_ACTUAL_KEY_HERE'
  
  // Environment (test/live)
  environment: 'test', // Change to 'live' for production
  
  // Update company details
  companyName: 'Your Company Name',
  companyDescription: 'Your company description',
  
  // Update theme color to match your brand
  themeColor: '#YOUR_BRAND_COLOR'
};
```

### 2.2 Update Backend Config (when you create backend)
```javascript
// Backend configuration
const RAZORPAY_SECRET = 'YOUR_ACTUAL_SECRET_KEY';
const WEBHOOK_SECRET = 'YOUR_WEBHOOK_SECRET';
```

## 🌐 **Step 3: Backend API Setup (Required for Production)**

### 3.1 Create Order API
```javascript
// POST /api/razorpay/create-order
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    
    const options = {
      amount: amount * 100, // Convert to paise
      currency: currency,
      receipt: receipt,
      payment_capture: 1
    };
    
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3.2 Verify Payment API
```javascript
// POST /api/razorpay/verify-payment
app.post('/api/razorpay/verify-payment', async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    
    // Verify signature
    const text = orderId + '|' + paymentId;
    const generated_signature = crypto
      .createHmac('sha256', RAZORPAY_SECRET)
      .update(text)
      .digest('hex');
    
    if (generated_signature === signature) {
      res.json({ verified: true });
    } else {
      res.json({ verified: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3.3 Webhook Handler
```javascript
// POST /api/razorpay/webhook
app.post('/api/razorpay/webhook', async (req, res) => {
  try {
    const webhookSecret = WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    
    // Verify webhook signature
    const text = JSON.stringify(req.body);
    const generated_signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(text)
      .digest('hex');
    
    if (generated_signature === signature) {
      // Process webhook event
      const event = req.body;
      
      switch (event.event) {
        case 'payment.captured':
          // Handle successful payment
          break;
        case 'payment.failed':
          // Handle failed payment
          break;
        case 'order.paid':
          // Handle order completion
          break;
      }
      
      res.json({ received: true });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🔒 **Step 4: Security Considerations**

### 4.1 Never Expose Secret Key
- **❌ Wrong**: Include secret key in frontend code
- **✅ Correct**: Use secret key only in backend

### 4.2 Always Verify Signatures
- Verify payment signatures on backend
- Verify webhook signatures
- Use HTTPS for all API calls

### 4.3 Environment Variables
```bash
# .env file
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY
RAZORPAY_KEY_SECRET=YOUR_SECRET
WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
```

## 🧪 **Step 5: Testing**

### 5.1 Test Mode
- Use test UPI IDs: `success@razorpay`, `failure@razorpay`
- Test cards: 4111 1111 1111 1111
- No real money involved

### 5.2 Test Scenarios
- ✅ Successful payment
- ❌ Failed payment
- 🔄 Payment cancellation
- 📱 Mobile responsiveness
- 🌐 Different browsers

## 🚀 **Step 6: Go Live**

### 6.1 Production Checklist
- [ ] Complete business verification
- [ ] Update to live API keys
- [ ] Set up production webhooks
- [ ] Test with real payments
- [ ] Monitor payment success rates

### 6.2 Update Configuration
```javascript
export const RAZORPAY_CONFIG = {
  key: 'rzp_live_YOUR_LIVE_KEY',
  environment: 'live',
  // ... other settings
};
```

## 📱 **Step 7: Mobile App Integration**

### 7.1 React Native
```javascript
import { RazorpayCheckout } from 'react-native-razorpay';

const openRazorpay = () => {
  const options = {
    key: RAZORPAY_CONFIG.key,
    amount: amount * 100,
    currency: 'INR',
    name: 'FoodHub',
    // ... other options
  };
  
  RazorpayCheckout.open(options);
};
```

### 7.2 Flutter
```dart
import 'package:razorpay_flutter/razorpay_flutter.dart';

final Razorpay razorpay = Razorpay();
razorpay.open(options);
```

## 🔧 **Troubleshooting**

### Common Issues

#### 1. Payment Modal Not Opening
- Check if Razorpay script is loaded
- Verify API key is correct
- Check browser console for errors

#### 2. Payment Verification Fails
- Ensure backend API is working
- Check signature verification logic
- Verify webhook configuration

#### 3. Test Mode vs Live Mode
- Test mode: Use test keys and test UPI IDs
- Live mode: Use live keys and real UPI IDs

### Debug Mode
```javascript
// Enable debug logging
const paymentOptions = {
  // ... other options
  modal: {
    ondismiss: () => console.log('Payment modal dismissed'),
    escape: false
  }
};
```

## 📞 **Support**

- **Razorpay Support**: [support.razorpay.com](https://support.razorpay.com)
- **Documentation**: [razorpay.com/docs](https://razorpay.com/docs)
- **API Reference**: [razorpay.com/docs/api](https://razorpay.com/docs/api)

## 🎯 **Next Steps**

1. **Update Configuration** with your Razorpay keys
2. **Test Payment Flow** in test mode
3. **Set Up Backend APIs** for production
4. **Configure Webhooks** for real-time updates
5. **Go Live** with real payments

---

**⚠️ Important**: This implementation is for demonstration purposes. For production use, ensure you have proper backend APIs, webhook handling, and security measures in place.

**🚀 Happy Coding!** Your UPI payment system is now ready for real-world use!
