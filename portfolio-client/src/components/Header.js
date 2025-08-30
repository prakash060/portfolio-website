import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Badge, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem, 
  Avatar,
  Divider
} from '@mui/material';
import { ShoppingCart, Person, KeyboardArrowDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { getCartItemCount } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
    handleCloseMenu();
  };

  const handleProfileDetails = () => {
    // Navigate to profile details page
    navigate('/profile');
    handleCloseMenu();
  };

  const open = Boolean(anchorEl);

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
              
              {/* User Profile Section */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  color="inherit"
                  onClick={handleProfileClick}
                  startIcon={
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  }
                  endIcon={<KeyboardArrowDown />}
                  sx={{ 
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  {user.name}
                </Button>
                
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      borderRadius: 2,
                    }
                  }}
                >
                  <MenuItem 
                    onClick={handleProfileDetails}
                    sx={{ 
                      py: 1.5,
                      px: 2,
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    <Person sx={{ mr: 2, color: '#2E7D32' }} />
                    Details
                  </MenuItem>
                  
                  <Divider />
                  
                  <MenuItem 
                    onClick={handleSignOut}
                    sx={{ 
                      py: 1.5,
                      px: 2,
                      color: '#d32f2f',
                      '&:hover': {
                        backgroundColor: '#ffebee'
                      }
                    }}
                  >
                    <Person sx={{ mr: 2, color: '#d32f2f' }} />
                    LogOut
                  </MenuItem>
                </Menu>
              </Box>
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
