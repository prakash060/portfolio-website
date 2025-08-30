import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { 
  QrCode, 
  PhoneAndroid, 
  CheckCircle, 
  Error, 
  Payment,
  Timer
} from '@mui/icons-material';
import { usePayment } from '../context/PaymentContext';

const UpiPayment = ({ open, onClose, orderDetails, onPaymentComplete, onPaymentFailed }) => {
  const { initiateUpiPayment, paymentStatus, currentPayment, resetPaymentStatus } = usePayment();
  const [upiId, setUpiId] = useState('');
  const [step, setStep] = useState(0); // 0: UPI ID input, 1: Payment processing, 2: Result
  const [countdown, setCountdown] = useState(30); // 30 second countdown for demo

  const steps = ['Enter UPI ID', 'Processing Payment', 'Payment Result'];

  useEffect(() => {
    if (open) {
      setStep(0);
      setUpiId('');
      resetPaymentStatus();
    }
  }, [open, resetPaymentStatus]);

  useEffect(() => {
    let timer;
    if (step === 1 && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handleUpiIdSubmit = async () => {
    if (!upiId.trim()) return;
    
    setStep(1);
    setCountdown(30);
    
    try {
      const result = await initiateUpiPayment(orderDetails, upiId);
      
      if (result.success) {
        setStep(2);
        setTimeout(() => {
          onPaymentComplete(orderDetails);
          onClose();
        }, 3000);
      } else {
        setStep(2);
        setTimeout(() => {
          onPaymentFailed(orderDetails);
          onClose();
        }, 3000);
      }
    } catch (error) {
      setStep(2);
      setTimeout(() => {
        onPaymentFailed(orderDetails);
        onClose();
      }, 3000);
    }
  };

  const handleClose = () => {
    if (step === 1) return; // Prevent closing during payment processing
    onClose();
  };

  const renderUpiIdInput = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Enter Your UPI ID
      </Typography>
      <TextField
        fullWidth
        label="UPI ID"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        placeholder="username@upi"
        helperText="Enter your UPI ID (e.g., username@okicici, username@paytm)"
        sx={{ mb: 3 }}
      />
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>How it works:</strong>
        </Typography>
        <Typography variant="body2" component="div">
          1. Enter your UPI ID above
          2. Click "Initiate Payment" 
          3. You'll receive a payment request on your UPI app
          4. Complete the payment in your UPI app
          5. Wait for confirmation
        </Typography>
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <QrCode sx={{ fontSize: 40, color: '#2E7D32', mb: 1 }} />
          <Typography variant="caption">Scan QR Code</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <PhoneAndroid sx={{ fontSize: 40, color: '#2E7D32', mb: 1 }} />
          <Typography variant="caption">Use UPI App</Typography>
        </Box>
      </Box>
    </Box>
  );

  const renderPaymentProcessing = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Payment Processing
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <CircularProgress size={60} sx={{ color: '#2E7D32' }} />
      </Box>

      <Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
        <CardContent>
          <Typography variant="body1" gutterBottom>
            <strong>Amount:</strong> ₹{orderDetails.total.toFixed(0)}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>UPI ID:</strong> {upiId}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Order ID:</strong> {orderDetails.id}
          </Typography>
        </CardContent>
      </Card>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Please complete the payment in your UPI app now!</strong>
        </Typography>
        <Typography variant="body2">
          You should have received a payment request. Please approve it to continue.
        </Typography>
      </Alert>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Timer sx={{ color: '#f57c00' }} />
        <Typography variant="body2" color="text.secondary">
          Time remaining: {countdown}s
        </Typography>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Don't close this window while payment is processing
      </Typography>
    </Box>
  );

  const renderPaymentResult = () => {
    const isSuccess = paymentStatus === 'success';
    
    return (
      <Box sx={{ textAlign: 'center' }}>
        {isSuccess ? (
          <>
            <CheckCircle sx={{ fontSize: 80, color: '#2E7D32', mb: 2 }} />
            <Typography variant="h5" color="#2E7D32" gutterBottom>
              Payment Successful! 🎉
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Your order has been confirmed and is being prepared.
            </Typography>
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Order ID:</strong> {orderDetails.id}
              </Typography>
              <Typography variant="body2">
                <strong>Amount Paid:</strong> ₹{orderDetails.total.toFixed(0)}
              </Typography>
            </Alert>
          </>
        ) : (
          <>
            <Error sx={{ fontSize: 80, color: '#d32f2f', mb: 2 }} />
            <Typography variant="h5" color="#d32f2f" gutterBottom>
              Payment Failed ❌
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              The payment could not be completed. Please try again.
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Order ID:</strong> {orderDetails.id}
              </Typography>
              <Typography variant="body2">
                <strong>Amount:</strong> ₹{orderDetails.total.toFixed(0)}
              </Typography>
            </Alert>
          </>
        )}
        
        <Typography variant="body2" color="text.secondary">
          Redirecting you automatically...
        </Typography>
      </Box>
    );
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderUpiIdInput();
      case 1:
        return renderPaymentProcessing();
      case 2:
        return renderPaymentResult();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={step === 1}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Payment sx={{ color: '#2E7D32' }} />
          <Typography variant="h6">UPI Payment</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={step} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {getStepContent(step)}
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        {step === 0 && (
          <Button
            variant="contained"
            onClick={handleUpiIdSubmit}
            disabled={!upiId.trim()}
            sx={{ 
              backgroundColor: '#2E7D32',
              '&:hover': { backgroundColor: '#1B5E20' },
              minWidth: 150
            }}
          >
            Initiate Payment
          </Button>
        )}
        
        {step === 1 && (
          <Button
            variant="outlined"
            disabled
            sx={{ minWidth: 150 }}
          >
            Processing...
          </Button>
        )}
        
        {step === 2 && (
          <Button
            variant="outlined"
            disabled
            sx={{ minWidth: 150 }}
          >
            Redirecting...
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UpiPayment;
