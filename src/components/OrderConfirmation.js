import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Box,
  Divider,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  CheckCircle, 
  LocalShipping, 
  Restaurant, 
  Home,
  AccessTime,
  LocationOn,
  Phone,
  Receipt
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrderById } = useOrders();
  
  const order = getOrderById(orderId);
  const loading = false;

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4">Loading order details...</Typography>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Order not found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Go to Home
        </Button>
      </Container>
    );
  }

  const getOrderStatus = () => {
    const now = new Date();
    const orderDate = new Date(order.orderDate);
    const estimatedDelivery = new Date(order.estimatedDelivery);
    
    if (now < orderDate) return 'preparing';
    if (now < estimatedDelivery) return 'onTheWay';
    return 'delivered';
  };

  const getStatusSteps = () => {
    const status = getOrderStatus();
    const steps = [
      { label: 'Order Confirmed', icon: CheckCircle, completed: true },
      { label: 'Preparing', icon: Restaurant, completed: status !== 'confirmed' },
      { label: 'On the Way', icon: LocalShipping, completed: status === 'onTheWay' || status === 'delivered' },
      { label: 'Delivered', icon: Home, completed: status === 'delivered' }
    ];
    return steps;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedTime = () => {
    const now = new Date();
    const estimated = new Date(order.estimatedDelivery);
    const diffMs = estimated - now;
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins <= 0) return 'Delivered';
    if (diffMins < 60) return `${diffMins} minutes`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Success Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <CheckCircle sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
          🎉 Order Confirmed!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Thank you for your order. We're preparing your delicious food!
        </Typography>
        <Chip 
          label={`Order #${order.id}`} 
          variant="outlined" 
          sx={{ mt: 2, fontSize: '1.1rem' }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* Order Status */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#2E7D32' }}>
              Order Status
            </Typography>
            <Stepper orientation="vertical" sx={{ mt: 2 }}>
              {getStatusSteps().map((step, index) => (
                <Step key={step.label} active={step.completed} completed={step.completed}>
                  <StepLabel
                    StepIconComponent={step.icon}
                    sx={{
                      '& .MuiStepLabel-iconContainer': {
                        color: step.completed ? '#4CAF50' : '#ccc'
                      }
                    }}
                  >
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <AccessTime sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                Estimated delivery: <strong>{getEstimatedTime()}</strong>
              </Typography>
            </Box>
          </Card>

          {/* Order Items */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#2E7D32' }}>
              Order Items
            </Typography>
            <List>
              {order.items.map((item) => (
                <ListItem key={item.id} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity}`}
                  />
                  <Typography variant="h6" color="primary">
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body1">
              Subtotal: <strong>₹{order.subtotal.toFixed(0)}</strong>
            </Typography>
            <Typography variant="body1">
              Delivery Fee: <strong>
                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee.toFixed(0)}`}
              </strong>
            </Typography>
            <Typography variant="body1">
              Tax: <strong>₹{order.tax.toFixed(0)}</strong>
            </Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
              Total: <strong>₹{order.total.toFixed(0)}</strong>
            </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Order Details Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32' }}>
              <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
              Order Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Order Date
              </Typography>
              <Typography variant="body1">
                {formatDate(order.orderDate)}
              </Typography>
            </Box>
                         <Box sx={{ mb: 2 }}>
               <Typography variant="body2" color="text.secondary">
                 Payment Method
               </Typography>
               <Typography variant="body1">
                 {order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                  order.paymentMethod === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}
               </Typography>
               {order.paymentMethod === 'upi' && order.upiDetails && (
                 <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                   UPI ID: {order.upiDetails.upiId}
                 </Typography>
               )}
             </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Order Status
              </Typography>
              <Chip 
                label={getOrderStatus().replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                color={getOrderStatus() === 'delivered' ? 'success' : 'primary'}
                size="small"
              />
            </Box>
          </Card>

          {/* Delivery Information */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32' }}>
              <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
              Delivery Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {order.deliveryDetails.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.deliveryDetails.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.deliveryDetails.city}, {order.deliveryDetails.zipCode}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <Phone sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                {order.deliveryDetails.phone}
              </Typography>
            </Box>
            {order.deliveryDetails.deliveryInstructions && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Instructions: {order.deliveryDetails.deliveryInstructions}
                </Typography>
              </Box>
            )}
          </Card>

          {/* Actions */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32' }}>
              Need Help?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              If you have any questions about your order, please contact us.
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/food-catalog')}
              sx={{ mb: 1 }}
            >
              Order More Food
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/orders')}
              sx={{ 
                backgroundColor: '#2E7D32',
                '&:hover': { backgroundColor: '#1B5E20' }
              }}
            >
              View All Orders
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Important Notes */}
      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body2">
          <strong>Important:</strong> Please ensure someone is available at the delivery address. 
          Our delivery partner will contact you when they're on the way. 
          For any changes to your order, please contact us immediately.
        </Typography>
      </Alert>
    </Container>
  );
};

export default OrderConfirmation;
