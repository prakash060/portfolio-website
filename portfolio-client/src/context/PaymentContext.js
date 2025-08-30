import React, { createContext, useContext, useState } from 'react';
import { RAZORPAY_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config/razorpay';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, failed
  const [currentPayment, setCurrentPayment] = useState(null);
  const [razorpayInstance, setRazorpayInstance] = useState(null);

  // Initialize Razorpay
  const initializeRazorpay = () => {
    if (window.Razorpay) {
      return window.Razorpay;
    }
    
    // Load Razorpay script if not already loaded
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayInstance(window.Razorpay);
    };
    document.body.appendChild(script);
    
    return null;
  };

  // Initialize UPI payment with Razorpay
  const initiateUpiPayment = async (orderDetails, upiId) => {
    setPaymentStatus('processing');
    setCurrentPayment({
      orderId: orderDetails.id,
      amount: orderDetails.total,
      upiId: upiId,
      timestamp: new Date().toISOString()
    });

    try {
      // Initialize Razorpay if not already done
      const razorpay = initializeRazorpay();
      if (!razorpay) {
        // Wait for script to load
        await new Promise(resolve => {
          const checkRazorpay = () => {
            if (window.Razorpay) {
              setRazorpayInstance(window.Razorpay);
              resolve();
            } else {
              setTimeout(checkRazorpay, 100);
            }
          };
          checkRazorpay();
        });
      }

      // Create payment options for Razorpay
      const paymentOptions = {
        key: RAZORPAY_CONFIG.key,
        amount: Math.round(orderDetails.total * 100), // Amount in paise
        currency: RAZORPAY_CONFIG.currency,
        name: RAZORPAY_CONFIG.companyName,
        description: `${RAZORPAY_CONFIG.companyDescription} - Order ${orderDetails.id}`,
        order_id: `order_${Date.now()}`, // This should come from your backend
        prefill: {
          contact: orderDetails.deliveryDetails.phone || '',
          email: orderDetails.user?.email || '',
          name: orderDetails.deliveryDetails.fullName || ''
        },
        notes: {
          order_id: orderDetails.id,
          upi_id: upiId
        },
        theme: {
          color: RAZORPAY_CONFIG.themeColor
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus('failed');
            return { success: false, message: ERROR_MESSAGES.paymentCancelled };
          }
        },
        handler: function (response) {
          // Payment successful
          setPaymentStatus('success');
          return { 
            success: true, 
            message: SUCCESS_MESSAGES.paymentSuccess,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id
          };
        }
      };

      // Create Razorpay instance and open payment modal
      const razorpayInstance = new window.Razorpay(paymentOptions);
      
      // Open payment modal
      razorpayInstance.open();
      
      // Return promise that resolves when payment is completed
      return new Promise((resolve, reject) => {
        razorpayInstance.on('payment.failed', (response) => {
          setPaymentStatus('failed');
          resolve({ 
            success: false, 
            message: `${ERROR_MESSAGES.paymentFailed}: ${response.error.description}`,
            errorCode: response.error.code
          });
        });

        razorpayInstance.on('payment.success', (response) => {
          setPaymentStatus('success');
          resolve({ 
            success: true, 
            message: 'Payment successful!',
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id
          });
        });
      });

    } catch (error) {
      console.error('Payment initiation failed:', error);
      setPaymentStatus('failed');
      return { 
        success: false, 
        message: 'Payment initiation failed. Please try again.' 
      };
    }
  };

  // Verify payment with backend (this would call your server to verify with Razorpay)
  const verifyPayment = async (paymentId, orderId, signature) => {
    try {
      // In real implementation, this would call your backend API
      // const response = await fetch('/api/verify-payment', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ paymentId, orderId, signature })
      // });
      // return await response.json();

      // For now, simulate verification (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate verification success (90% success rate)
      const success = Math.random() > 0.1;
      
      if (success) {
        return { 
          verified: true, 
          message: 'Payment verified successfully' 
        };
      } else {
        return { 
          verified: false, 
          message: 'Payment verification failed' 
        };
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      return { 
        verified: false, 
        message: 'Payment verification error' 
      };
    }
  };

  // Check payment status from Razorpay
  const checkPaymentStatus = async (paymentId) => {
    try {
      // In real implementation, this would call your backend API
      // const response = await fetch(`/api/payment-status/${paymentId}`);
      // return await response.json();

      // For now, simulate status check (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statuses = ['pending', 'processing', 'completed', 'failed'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        status: randomStatus,
        message: `Payment is ${randomStatus}`,
        timestamp: new Date().toISOString(),
        paymentId: paymentId
      };
    } catch (error) {
      console.error('Payment status check failed:', error);
      return {
        status: 'error',
        message: 'Failed to check payment status',
        timestamp: new Date().toISOString()
      };
    }
  };

  // Reset payment status
  const resetPaymentStatus = () => {
    setPaymentStatus('idle');
    setCurrentPayment(null);
  };

  const value = {
    paymentStatus,
    currentPayment,
    initiateUpiPayment,
    verifyPayment,
    checkPaymentStatus,
    resetPaymentStatus,
    razorpayInstance
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
