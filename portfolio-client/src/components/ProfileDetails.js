import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Avatar,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { ArrowBack, Person, Email, Badge } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfileDetails = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" textAlign="center" color="error">
          Please sign in to view your profile
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="contained" onClick={() => navigate('/signin')}>
            Sign In
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="md">
        {/* Header with Go Back Button */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
            sx={{
              mb: 2,
              color: '#2E7D32',
              '&:hover': {
                backgroundColor: 'rgba(46, 125, 50, 0.1)'
              }
            }}
          >
            Go Back
          </Button>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
            Profile Details
          </Typography>
        </Box>

        {/* Profile Card */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            {/* Profile Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: '#2E7D32',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  mr: 3
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Box>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {user.name || 'User'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Member since {new Date(user.id).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Profile Information */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%', backgroundColor: '#fafafa' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Badge sx={{ mr: 2, color: '#2E7D32' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Personal Information
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Full Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {user.name || 'Not provided'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      User ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}>
                      {user.id}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%', backgroundColor: '#fafafa' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email sx={{ mr: 2, color: '#2E7D32' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Contact Information
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Email Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {user.email || 'Not provided'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Account Status
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 'medium',
                        color: '#2E7D32',
                        backgroundColor: '#e8f5e8',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        display: 'inline-block'
                      }}
                    >
                      Active
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Additional Actions */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Need to update your information?
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => navigate('/food-catalog')}
              >
                Browse Menu
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/orders')}
              >
                View Orders
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfileDetails;
