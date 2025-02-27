import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Card, CardMedia, CardContent, CardActions, Grid, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SendRequest from './SendRequest';

const BrowseProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Fetching properties');
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/properties');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to fetch properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/property/${id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Browse Properties
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {properties.length === 0 ? (
            <Typography variant="body1">No properties available.</Typography>
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
                      <Button size="small" color="primary" onClick={() => handleViewDetails(property._id)}>
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default BrowseProperties;