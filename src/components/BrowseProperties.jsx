import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Button, Card, CardMedia, CardContent, CardActions, Grid, CircularProgress, Alert, TextField, MenuItem, Select, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SendRequest from './SendRequest';

const BrowseProperties = ({ role }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    footfall: '',
    footfallType: 'Daily',
    dimensions: '',
    availability: 'Available',
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Fetching properties');
    const fetchProperties = async () => {
      try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`http://localhost:5000/api/properties?${queryParams}`);
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
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

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
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  type="number"
                  fullWidth
                  label="Min Monthly Price"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  type="number"
                  fullWidth
                  label="Max Monthly Price"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  type="number"
                  fullWidth
                  label="Estimated Footfall"
                  name="footfall"
                  value={filters.footfall}
                  onChange={handleFilterChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField select fullWidth label="Footfall Type" name="footfallType" value={filters.footfallType} onChange={handleFilterChange} margin="normal">
                  {['Daily', 'Weekly', 'Monthly'].map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField select fullWidth label="Dimensions" name="dimensions" value={filters.dimensions} onChange={handleFilterChange} margin="normal">
                  {['Small', 'Medium', 'Large'].map((size) => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField select fullWidth label="Availability" name="availability" value={filters.availability} onChange={handleFilterChange} margin="normal">
                  {['Available', 'Requested', 'Approved', 'Rejected'].map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {role === 'owner' ? (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                My Properties
              </Typography>
              {properties.filter(property => property.owner._id.toString() === localStorage.getItem('userId')).length === 0 ? (
                <Typography variant="body1">No properties listed.</Typography>
              ) : (
                <Grid container spacing={3}>
                  {properties.filter(property => property.owner._id.toString() === localStorage.getItem('userId')).map((property) => (
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
                            Address: {property.address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Monthly Pricing: ${property.pricing.monthly}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary" onClick={() => handleViewDetails(property._id)}>
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          ) : null}

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Other Properties
            </Typography>
            {properties.filter(property => property.owner._id.toString() !== localStorage.getItem('userId')).length === 0 ? (
              <Typography variant="body1">No properties available.</Typography>
            ) : (
              <Grid container spacing={3}>
                {properties.filter(property => property.owner._id.toString() !== localStorage.getItem('userId')).map((property) => (
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
                          Address: {property.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monthly Pricing: ${property.pricing.monthly}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        {role === 'business' && (
                          <Button size="small" color="secondary" onClick={() => navigate(`/request/${property._id}`)}>
                            Send Request
                          </Button>
                        )}
                        <Button size="small" color="primary" onClick={() => handleViewDetails(property._id)}>
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {role === 'business' ? (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Requested Properties
              </Typography>
              {properties.filter(property => property.status === 'Requested').length === 0 ? (
                <Typography variant="body1">No requested properties.</Typography>
              ) : (
                <Grid container spacing={3}>
                  {properties.filter(property => property.status === 'Requested').map((property) => (
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
                            Address: {property.address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Monthly Pricing: ${property.pricing.monthly}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary" onClick={() => handleViewDetails(property._id)}>
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          ) : null}
        </>
      )}
    </Container>
  );
};

export default BrowseProperties;