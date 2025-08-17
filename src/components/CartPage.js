import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Box,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleQuantityChange = (foodId, newQuantity) => {
    updateQuantity(foodId, newQuantity);
  };

  const handleRemoveItem = (foodId) => {
    removeFromCart(foodId);
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <ShoppingCart sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom color="text.secondary">
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added any delicious food to your cart yet.
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
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
          🛒 Your Cart
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Review your order and proceed to checkout
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Cart Items ({cart.length})
          </Typography>
          
          {cart.map((item) => (
            <Card key={item.id} sx={{ mb: 2, display: 'flex' }}>
              <CardMedia
                component="img"
                sx={{ width: 120, height: 120 }}
                image={item.image}
                alt={item.name}
              />
              
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Remove />
                    </IconButton>
                    
                    <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                      {item.quantity}
                    </Typography>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </Typography>
                    
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={clearCart}
              sx={{ borderColor: '#f44336', color: '#f44336' }}
            >
              Clear Cart
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => navigate('/food-catalog')}
              sx={{ borderColor: '#2E7D32', color: '#2E7D32' }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#2E7D32' }}>
              Order Summary
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              {cart.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total</Typography>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              ₹{total.toFixed(0)}
            </Typography>
            </Box>
            
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCheckout}
              sx={{ 
                backgroundColor: '#2E7D32',
                '&:hover': { backgroundColor: '#1B5E20' },
                py: 1.5
              }}
            >
              Proceed to Checkout
            </Button>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              Free delivery on orders over ₹1000!
            </Alert>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
