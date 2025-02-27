import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Button, Card, CardMedia, CardContent, Grid, CircularProgress, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const PropertyDetails = ({ role }) => { // Add role as a prop
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Fetching property details');
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/properties/${id}`);
        const data = await response.json();
        if (data._id) {
          setProperty(data);
        } else {
          setError('Property not found.');
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        setError('Failed to fetch property. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleBackToDashboard = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : property ? (
        <>
          <Typography variant="h4" gutterBottom>
            {property.title}
          </Typography>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={property.images[0] || 'https://via.placeholder.com/400'}
              alt={property.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {property.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {property.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Address: {property.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Landmarks: {property.landmarks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dimensions: {property.dimensions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estimated Footfall: {property.footfall} {property.footfallType.toLowerCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expected Traffic: {property.expectedTraffic}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={handleBackToDashboard}>
                Back
              </Button>
              {role === 'business' && (
                <Button size="small" color="secondary" onClick={() => navigate(`/request/${id}`)}>
                  Send Request
                </Button>
              )}
            </CardActions>
          </Card>
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Images
            </Typography>
            <Grid container spacing={2}>
              {property.images.map((imagePath, index) => (
                <Grid item key={index}>
                  <Card sx={{ maxWidth: 150 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={`http://localhost:5000/${imagePath}`} // Ensure absolute URL
                      alt={`Image ${index + 1}`}
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Image {index + 1}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      ) : (
        <Alert severity="error">Property not found.</Alert>
      )}
    </Container>
  );
};

export default PropertyDetails;