import React, { createContext, useContext, useState } from 'react';

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

  // Simulate UPI payment initiation
  const initiateUpiPayment = async (orderDetails, upiId) => {
    setPaymentStatus('processing');
    setCurrentPayment({
      orderId: orderDetails.id,
      amount: orderDetails.total,
      upiId: upiId,
      timestamp: new Date().toISOString()
    });

    try {
      // Simulate UPI payment request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate payment success (in real app, this would be webhook from UPI gateway)
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      if (success) {
        setPaymentStatus('success');
        return { success: true, message: 'Payment successful!' };
      } else {
        setPaymentStatus('failed');
        return { success: false, message: 'Payment failed. Please try again.' };
      }
    } catch (error) {
      setPaymentStatus('failed');
      return { success: false, message: 'Payment error occurred.' };
    }
  };

  // Simulate payment status check (in real app, this would poll UPI gateway)
  const checkPaymentStatus = async (paymentId) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate different payment states
    const statuses = ['pending', 'processing', 'completed', 'failed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      status: randomStatus,
      message: `Payment is ${randomStatus}`,
      timestamp: new Date().toISOString()
    };
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
    checkPaymentStatus,
    resetPaymentStatus
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
