import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Box,
  Rating,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';
import { Search, Add, Remove } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { foodData, categories } from '../data/foodData';

const FoodCatalog = () => {
  const { addToCart, removeFromCart, updateQuantity, cart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter foods based on category and search term
  const filteredFoods = foodData.filter(food => {
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCartItemQuantity = (foodId) => {
    const cartItem = cart.find(item => item.id === foodId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (food) => {
    addToCart(food);
  };

  const handleRemoveFromCart = (food) => {
    const currentQuantity = getCartItemQuantity(food.id);
    if (currentQuantity > 1) {
      updateQuantity(food.id, currentQuantity - 1);
    } else {
      removeFromCart(food.id);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
          🍽️ Our Menu
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover our delicious selection of food
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          placeholder="Search food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
      </Box>

      {/* Food Grid */}
      <Grid container spacing={4}>
        {filteredFoods.map((food) => {
          const cartQuantity = getCartItemQuantity(food.id);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={food.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={food.image}
                  alt={food.name}
                  sx={{ objectFit: 'cover' }}
                />
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {food.name}
                    </Typography>
                    <Chip 
                      label={food.category} 
                      size="small" 
                      sx={{ backgroundColor: '#2E7D32', color: 'white' }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {food.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={food.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        ({food.rating})
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ₹{food.price}
                    </Typography>
                  </Box>

                  {/* Cart Controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    {cartQuantity > 0 && (
                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleRemoveFromCart(food)}
                          sx={{ minWidth: 'auto', p: 1 }}
                        >
                          <Remove />
                        </Button>
                        <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                          {cartQuantity}
                        </Typography>
                      </>
                    )}
                    
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAddToCart(food)}
                      startIcon={<Add />}
                      sx={{ 
                        backgroundColor: '#2E7D32',
                        '&:hover': { backgroundColor: '#1B5E20' }
                      }}
                    >
                      {cartQuantity > 0 ? 'Add More' : 'Add to Cart'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredFoods.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No food items found matching your criteria.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default FoodCatalog;
