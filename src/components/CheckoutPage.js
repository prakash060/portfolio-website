import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const steps = ['Delivery Details', 'Payment Method', 'Order Review'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form states
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    deliveryInstructions: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [upiDetails, setUpiDetails] = useState({
    upiId: ''
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDeliveryChange = (field) => (event) => {
    setDeliveryDetails({
      ...deliveryDetails,
      [field]: event.target.value
    });
  };

  const handleCardChange = (field) => (event) => {
    setCardDetails({
      ...cardDetails,
      [field]: event.target.value
    });
  };

  const handleUpiChange = (field) => (event) => {
    setUpiDetails({
      ...upiDetails,
      [field]: event.target.value
    });
  };

  const calculateDeliveryFee = () => {
    return total >= 1000 ? 0 : 99; // Free delivery on orders over ₹1000, otherwise ₹99
  };

  const calculateTax = () => {
    return total * 0.05; // 5% GST (Indian tax rate)
  };

  const calculateTotal = () => {
    return total + calculateDeliveryFee() + calculateTax();
  };

  const validateDeliveryDetails = () => {
    const required = ['fullName', 'phone', 'address', 'city', 'zipCode'];
    return required.every(field => deliveryDetails[field].trim() !== '');
  };

  const validateCardDetails = () => {
    if (paymentMethod === 'card') {
      const required = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
      return required.every(field => cardDetails[field].trim() !== '');
    }
    if (paymentMethod === 'upi') {
      const required = ['upiId'];
      return required.every(field => upiDetails[field].trim() !== '');
    }
    return true;
  };

  const canProceed = () => {
    if (activeStep === 0) return validateDeliveryDetails();
    if (activeStep === 1) return validateCardDetails();
    return true;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order ID
      const newOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setOrderId(newOrderId);
      
             // Create order object
       const order = {
         id: newOrderId,
         userId: user.id,
         items: cart,
         deliveryDetails,
         paymentMethod,
         cardDetails: paymentMethod === 'card' ? cardDetails : null,
         upiDetails: paymentMethod === 'upi' ? upiDetails : null,
         subtotal: total,
         deliveryFee: calculateDeliveryFee(),
         tax: calculateTax(),
         total: calculateTotal(),
         status: 'confirmed',
         orderDate: new Date().toISOString(),
         estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString() // 45 minutes from now
       };

      // Add order using context
      addOrder(order);
      
      // Clear cart
      clearCart();
      
      // Navigate to order confirmation
      navigate(`/order-confirmation/${newOrderId}`);
      
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderDeliveryStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Full Name"
          value={deliveryDetails.fullName}
          onChange={handleDeliveryChange('fullName')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Phone Number"
          value={deliveryDetails.phone}
          onChange={handleDeliveryChange('phone')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Delivery Address"
          value={deliveryDetails.address}
          onChange={handleDeliveryChange('address')}
          multiline
          rows={2}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="City"
          value={deliveryDetails.city}
          onChange={handleDeliveryChange('city')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="ZIP Code"
          value={deliveryDetails.zipCode}
          onChange={handleDeliveryChange('zipCode')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Delivery Instructions (Optional)"
          value={deliveryDetails.deliveryInstructions}
          onChange={handleDeliveryChange('deliveryInstructions')}
          multiline
          rows={2}
          placeholder="e.g., Ring doorbell, leave at front desk"
        />
      </Grid>
    </Grid>
  );

  const renderPaymentStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Payment Method</FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
            <FormControlLabel value="upi" control={<Radio />} label="UPI Payment" />
            <FormControlLabel value="cash" control={<Radio />} label="Cash on Delivery" />
          </RadioGroup>
        </FormControl>
      </Grid>
      
      {paymentMethod === 'card' && (
        <>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Card Number"
              value={cardDetails.cardNumber}
              onChange={handleCardChange('cardNumber')}
              placeholder="1234 5678 9012 3456"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Expiry Date"
              value={cardDetails.expiryDate}
              onChange={handleCardChange('expiryDate')}
              placeholder="MM/YY"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="CVV"
              value={cardDetails.cvv}
              onChange={handleCardChange('cvv')}
              placeholder="123"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Cardholder Name"
              value={cardDetails.cardholderName}
              onChange={handleCardChange('cardholderName')}
            />
          </Grid>
        </>
      )}

      {paymentMethod === 'upi' && (
        <>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="UPI ID"
              value={upiDetails.upiId}
              onChange={handleUpiChange('upiId')}
              placeholder="username@upi"
              helperText="Enter your UPI ID (e.g., username@okicici, username@paytm)"
            />
          </Grid>
          <Grid item xs={12}>
            <Alert severity="info">
              You will receive a payment request on your UPI app. Please complete the payment to confirm your order.
            </Alert>
          </Grid>
        </>
      )}
      
      {paymentMethod === 'cash' && (
        <Grid item xs={12}>
          <Alert severity="info">
            Please have the exact amount ready. We don't carry change for orders over ₹1000.
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  const renderReviewStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Typography variant="h6" gutterBottom>Order Items</Typography>
        {cart.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>
              {item.name} x {item.quantity}
            </Typography>
            <Typography>₹{(item.price * item.quantity).toFixed(0)}</Typography>
          </Box>
        ))}
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>Delivery Details</Typography>
        <Typography><strong>Name:</strong> {deliveryDetails.fullName}</Typography>
        <Typography><strong>Phone:</strong> {deliveryDetails.phone}</Typography>
        <Typography><strong>Address:</strong> {deliveryDetails.address}</Typography>
        <Typography><strong>City:</strong> {deliveryDetails.city}, {deliveryDetails.zipCode}</Typography>
        {deliveryDetails.deliveryInstructions && (
          <Typography><strong>Instructions:</strong> {deliveryDetails.deliveryInstructions}</Typography>
        )}
        
        <Divider sx={{ my: 2 }} />
        
                 <Typography variant="h6" gutterBottom>Payment Method</Typography>
         <Typography>
           {paymentMethod === 'card' ? 'Credit/Debit Card' : 
            paymentMethod === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}
         </Typography>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Order Summary</Typography>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography>₹{total.toFixed(0)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Delivery Fee</Typography>
              <Typography>
                {calculateDeliveryFee() === 0 ? 'FREE' : `₹${calculateDeliveryFee().toFixed(0)}`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tax (5% GST)</Typography>
              <Typography>₹{calculateTax().toFixed(0)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6"><strong>Total</strong></Typography>
              <Typography variant="h6" color="primary"><strong>₹{calculateTotal().toFixed(0)}</strong></Typography>
            </Box>
          </Box>
          
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handlePlaceOrder}
            disabled={loading}
            sx={{ 
              backgroundColor: '#2E7D32',
              '&:hover': { backgroundColor: '#1B5E20' },
              py: 1.5
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
          </Button>
          
          {calculateDeliveryFee() === 0 && (
            <Alert severity="success" sx={{ mt: 2 }}>
              🎉 Free delivery on orders over ₹1000!
            </Alert>
          )}
        </Card>
      </Grid>
    </Grid>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderDeliveryStep();
      case 1:
        return renderPaymentStep();
      case 2:
        return renderReviewStep();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', color: '#2E7D32', mb: 4 }}>
        🛒 Checkout
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Card sx={{ p: 4 }}>
        {getStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handlePlaceOrder}
                disabled={loading}
                sx={{ 
                  backgroundColor: '#2E7D32',
                  '&:hover': { backgroundColor: '#1B5E20' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!canProceed()}
                sx={{ 
                  backgroundColor: '#2E7D32',
                  '&:hover': { backgroundColor: '#1B5E20' }
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default CheckoutPage;
