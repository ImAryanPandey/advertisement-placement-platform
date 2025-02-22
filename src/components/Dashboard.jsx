import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Button, Card, CardMedia, CardContent, CardActions, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SendRequest from './SendRequest';

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/auth', {
            method: 'GET',
            headers: {
              'x-auth-token': token,
            },
          });
          const data = await response.json();
          if (data.user) {
            setRole(data.user.role);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
          navigate('/');
        }
      };
      verifyToken();
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/properties');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {role === 'owner' ? (
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" href="/add-property" sx={{ mb: 2 }}>
            Add Property
          </Button>
        </Box>
      ) : null}
      {properties.length === 0 ? (
        <Typography variant="body1">No properties listed.</Typography>
      ) : (
        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={property.images[0] || 'https://via.placeholder.com/300'}
                  alt={property.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {property.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {property.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Address: {property.address}
                  </Typography>
                </CardContent>
                <CardActions>
                  {role === 'business' ? <SendRequest propertyId={property._id} /> : null}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;