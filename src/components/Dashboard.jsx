import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Button, Card, CardMedia, CardContent, CardActions, Grid, CircularProgress, Alert, TextField, MenuItem, Select, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SendRequest from './SendRequest';

const Dashboard = ({ role }) => {
  const [properties, setProperties] = useState([]);
  const [ownedProperties, setOwnedProperties] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Fetching properties');
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/properties', {
          method: 'GET',
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
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

  useEffect(() => {
    console.log('Fetching owned properties');
    const fetchOwnedProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/properties', {
          method: 'GET',
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        const data = await response.json();
        const owned = data.filter(property => property.owner._id.toString() === localStorage.getItem('userId'));
        setOwnedProperties(owned);
      } catch (error) {
        console.error('Error fetching owned properties:', error);
        setError('Failed to fetch owned properties. Please try again later.');
      }
    };
    fetchOwnedProperties();
  }, []);

  useEffect(() => {
    console.log('Fetching requests');
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/requests/business', {
          method: 'GET',
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        const data = await response.json();
        setPendingRequests(data.filter(request => request.status === 'pending'));
        setApprovedRequests(data.filter(request => request.status === 'approved'));
        setRejectedRequests(data.filter(request => request.status === 'rejected'));
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError('Failed to fetch requests. Please try again later.');
      }
    };
    fetchRequests();
  }, [role]);

  const handleViewDetails = (id) => {
    navigate(`/property/${id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {role === 'owner' ? (
            <>
              <Typography variant="h5" gutterBottom>
                My Properties
              </Typography>
              {ownedProperties.length === 0 ? (
                <Typography variant="body1">No properties listed.</Typography>
              ) : (
                <Grid container spacing={3}>
                  {ownedProperties.map((property) => (
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

              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Pending Requests
              </Typography>
              {pendingRequests.length === 0 ? (
                <Typography variant="body1">No pending requests.</Typography>
              ) : (
                <Grid container spacing={3}>
                  {pendingRequests.map((request) => (
                    <Grid item xs={12} sm={6} md={4} key={request._id}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="140"
                          image={request.property.images[0] || 'https://via.placeholder.com/300'}
                          alt={request.property.title}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {request.property.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Address: {request.property.address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Monthly Pricing: ${request.property.pricing.monthly}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary" onClick={() => handleViewDetails(request.property._id)}>
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Approved Requests
              </Typography>
              {approvedRequests.length === 0 ? (
                <Typography variant="body1">No approved requests.</Typography>
              ) : (
                <Grid container spacing={3}>
                  {approvedRequests.map((request) => (
                    <Grid item xs={12} sm={6} md={4} key={request._id}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="140"
                          image={request.property.images[0] || 'https://via.placeholder.com/300'}
                          alt={request.property.title}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {request.property.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Address: {request.property.address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Monthly Pricing: ${request.property.pricing.monthly}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary" onClick={() => handleViewDetails(request.property._id)}>
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Rejected Requests
              </Typography>
              {rejectedRequests.length === 0 ? (
                <Typography variant="body1">No rejected requests.</Typography>
              ) : (
                <Grid container spacing={3}>
                  {rejectedRequests.map((request) => (
                    <Grid item xs={12} sm={6} md={4} key={request._id}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="140"
                          image={request.property.images[0] || 'https://via.placeholder.com/300'}
                          alt={request.property.title}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {request.property.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Address: {request.property.address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Monthly Pricing: ${request.property.pricing.monthly}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary" onClick={() => handleViewDetails(request.property._id)}>
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              <Box sx={{ mt: 4 }}>
                <Button variant="contained" color="primary" href="/add-property" sx={{ mb: 2 }}>
                  Add Property
                </Button>
                <Button variant="contained" color="secondary" href="/browse-properties" sx={{ mb: 2 }}>
                  Browse All Properties
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h5" gutterBottom>
                Pending Requests
              </Typography>
              {pendingRequests.length === 0 ? (
                <Typography variant="body1">No pending requests.</Typography>
              ) : (
                <Grid container spacing={3}>
                  {pendingRequests.map((request) => (
                    <Grid item xs={12} sm={6} md={4} key={request._id}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="140"
                          image={request.property.images[0] || 'https://via.placeholder.com/300'}
                          alt={request.property.title}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {request.property.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Address: {request.property.address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Monthly Pricing: ${request.property.pricing.monthly}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary" onClick={() => handleViewDetails(request.property._id)}>
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Approved Requests
              </Typography>
              {approvedRequests.length === 0 ? (
                <Typography variant="body1">No approved requests.</Typography>
              ) : (
                <Grid container spacing={3}>
                  {approvedRequests.map((request) => (
                    <Grid item xs={12} sm={6} md={4} key={request._id}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="140"
                          image={request.property.images[0] || 'https://via.placeholder.com/300'}
                          alt={request.property.title}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {request.property.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Address: {request.property.address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Monthly Pricing: ${request.property.pricing.monthly}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary" onClick={() => handleViewDetails(request.property._id)}>
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Rejected Requests
              </Typography>
              {rejectedRequests.length === 0 ? (
                <Typography variant="body1">No rejected requests.</Typography>
              ) : (
                <Grid container spacing={3}>
                  {rejectedRequests.map((request) => (
                    <Grid item xs={12} sm={6} md={4} key={request._id}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="140"
                          image={request.property.images[0] || 'https://via.placeholder.com/300'}
                          alt={request.property.title}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {request.property.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Address: {request.property.address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Monthly Pricing: ${request.property.pricing.monthly}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary" onClick={() => handleViewDetails(request.property._id)}>
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              <Box sx={{ mt: 4 }}>
                <Button variant="contained" color="secondary" href="/browse-properties" sx={{ mb: 2 }}>
                  Browse All Properties
                </Button>
              </Box>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Dashboard;