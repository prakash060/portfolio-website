import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Box,
  Rating,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { foodData } from '../data/foodData';

const Home = () => {
  const navigate = useNavigate();
  
  // Get 6 random food items for showcase
  const showcaseFoods = foodData.slice(0, 6);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to FoodHub 🍽️
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
            Discover delicious food delivered to your doorstep
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/signup')}
              sx={{ 
                backgroundColor: 'white', 
                color: '#2E7D32',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => navigate('/food-catalog')}
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              View Menu
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Foods Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          Featured Delicacies
        </Typography>
        
        <Grid container spacing={4}>
          {showcaseFoods.map((food) => (
            <Grid item xs={12} sm={6} md={4} key={food.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
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
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/signup')}
            sx={{ 
              backgroundColor: '#2E7D32',
              '&:hover': { backgroundColor: '#1B5E20' }
            }}
          >
            Join FoodHub Today
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
