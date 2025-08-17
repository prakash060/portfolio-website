import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  Alert,
  IconButton,
  Collapse
} from '@mui/material';
import { 
  ExpandMore, 
  ExpandLess,
  Receipt,
  AccessTime,
  LocalShipping,
  CheckCircle,
  Cancel,
  Restaurant
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserOrders, getOrderStatus } = useOrders();
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const orders = getUserOrders(user.id);
  const loading = false;

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // getOrderStatus is now provided by the context

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'onTheWay': return 'primary';
      case 'preparing': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle />;
      case 'onTheWay': return <LocalShipping />;
      case 'preparing': return <Restaurant />;
      default: return <AccessTime />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedTime = (order) => {
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

  const filterOrders = () => {
    switch (selectedTab) {
      case 0: // All orders
        return orders;
      case 1: // Active orders
        return orders.filter(order => getOrderStatus(order) !== 'delivered');
      case 2: // Completed orders
        return orders.filter(order => getOrderStatus(order) === 'delivered');
      default:
        return orders;
    }
  };

  const filteredOrders = filterOrders();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4">Loading your orders...</Typography>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Receipt sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom color="text.secondary">
          No Orders Yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Start ordering delicious food to see your order history here.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/food-catalog')}
          sx={{ 
            backgroundColor: '#2E7D32',
            '&:hover': { backgroundColor: '#1B5E20' }
          }}
        >
          Browse Our Menu
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
          📋 Order History
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Track your orders and view past deliveries
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label={`All Orders (${orders.length})`} />
          <Tab label={`Active (${orders.filter(order => getOrderStatus(order) !== 'delivered').length})`} />
          <Tab label={`Completed (${orders.filter(order => getOrderStatus(order) === 'delivered').length})`} />
        </Tabs>
      </Box>

      {/* Orders List */}
      <Grid container spacing={3}>
        {filteredOrders.map((order) => {
          const status = getOrderStatus(order);
          const isExpanded = expandedOrder === order.id;
          
          return (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  {/* Order Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Order #{order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(order.orderDate)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        icon={getStatusIcon(status)}
                        label={status.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        color={getStatusColor(status)}
                        size="small"
                      />
                      
                      <IconButton
                        onClick={() => toggleOrderExpansion(order.id)}
                        size="small"
                      >
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Order Summary */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} • Total: ${order.total.toFixed(2)}
                    </Typography>
                    
                    {status !== 'delivered' && (
                      <Typography variant="body2" color="primary">
                        <AccessTime sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                        {getEstimatedTime(order)}
                      </Typography>
                    )}
                  </Box>

                  {/* Expanded Order Details */}
                  <Collapse in={isExpanded}>
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={3}>
                      {/* Order Items */}
                      <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom>Order Items</Typography>
                        <List dense>
                          {order.items.map((item) => (
                            <ListItem key={item.id} sx={{ px: 0 }}>
                              <ListItemIcon>
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={item.name}
                                secondary={`Quantity: ${item.quantity}`}
                              />
                                                   <Typography variant="body2" color="primary">
                       ₹{(item.price * item.quantity).toFixed(0)}
                     </Typography>
                            </ListItem>
                          ))}
                        </List>
                        
                        <Box sx={{ textAlign: 'right', mt: 2 }}>
                                                   <Typography variant="body2">
                           Subtotal: ₹{order.subtotal.toFixed(0)}
                         </Typography>
                         <Typography variant="body2">
                           Delivery: {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee.toFixed(0)}`}
                         </Typography>
                         <Typography variant="body2">
                           Tax: ₹{order.tax.toFixed(0)}
                         </Typography>
                         <Typography variant="h6" color="primary">
                           Total: ₹{order.total.toFixed(0)}
                         </Typography>
                        </Box>
                      </Grid>

                      {/* Order Details */}
                      <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>Order Details</Typography>
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
                            Delivery Address
                          </Typography>
                          <Typography variant="body2">
                            {order.deliveryDetails.fullName}
                          </Typography>
                          <Typography variant="body2">
                            {order.deliveryDetails.address}
                          </Typography>
                          <Typography variant="body2">
                            {order.deliveryDetails.city}, {order.deliveryDetails.zipCode}
                          </Typography>
                        </Box>

                        {order.deliveryDetails.deliveryInstructions && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Instructions
                            </Typography>
                            <Typography variant="body2">
                              {order.deliveryDetails.deliveryInstructions}
                            </Typography>
                          </Box>
                        )}

                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => navigate(`/order-confirmation/${order.id}`)}
                          sx={{ mt: 2 }}
                        >
                          View Full Details
                        </Button>
                      </Grid>
                    </Grid>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* No Orders Message for Filtered Results */}
      {filteredOrders.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No orders found for the selected filter.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default OrderHistory;
