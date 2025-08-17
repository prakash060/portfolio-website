import React from 'react';
import { AppBar, Toolbar, Typography, Button, Badge, IconButton, Box } from '@mui/material';
import { ShoppingCart, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { getCartItemCount } = useCart();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2E7D32' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          🍽️ FoodHub
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Button 
                color="inherit" 
                onClick={() => navigate('/food-catalog')}
                sx={{ textTransform: 'none' }}
              >
                Menu
              </Button>
              
              <Button 
                color="inherit" 
                onClick={() => navigate('/orders')}
                sx={{ textTransform: 'none' }}
              >
                Orders
              </Button>
              
              <IconButton 
                color="inherit" 
                onClick={() => navigate('/cart')}
                sx={{ position: 'relative' }}
              >
                <Badge badgeContent={getCartItemCount()} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              
              <Button 
                color="inherit" 
                startIcon={<Person />}
                onClick={handleSignOut}
                sx={{ textTransform: 'none' }}
              >
                {user.name}
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                onClick={() => navigate('/signin')}
                sx={{ textTransform: 'none' }}
              >
                Sign In
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/signup')}
                sx={{ textTransform: 'none' }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
