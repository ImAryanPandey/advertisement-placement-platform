import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, MenuItem, Slider, Alert, Grid, Card, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone';

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    landmarks: '',
    dimensions: '',
    footfall: 500,
    footfallType: 'Daily',
    pricing: {
      monthly: '',
      weekly: '',
    },
    availability: {
      startDate: '',
      endDate: '',
    },
    images: [],
  });
  const [fileNames, setFileNames] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested fields like pricing.monthly
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFootfallChange = (e, value) => {
    setFormData({ ...formData, footfall: value });
  };

  const handleFileDrop = (acceptedFiles) => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...acceptedFiles] }));
    setFileNames(acceptedFiles.map(file => file.name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('dimensions', formData.dimensions);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('landmarks', formData.landmarks);
    formDataToSend.append('expectedTraffic', formData.expectedTraffic);
    formDataToSend.append('footfall', formData.footfall);
    formDataToSend.append('footfallType', formData.footfallType);
    formDataToSend.append('pricing.monthly', formData.pricing.monthly);
    formDataToSend.append('pricing.weekly', formData.pricing.weekly);
    formDataToSend.append('availability.startDate', formData.availability.startDate);
    formDataToSend.append('availability.endDate', formData.availability.endDate);
    for (let i = 0; i < formData.images.length; i++) {
      formDataToSend.append('images', formData.images[i]);
    }

    try {
      const response = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
        body: formDataToSend,
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        navigate('/dashboard');
      } else {
        setError(data.errors ? data.errors.map(err => err.msg).join('\n') : data.msg || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error listing property:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Add Property
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        {['title', 'description', 'address', 'landmarks', 'dimensions'].map((field) => (
          <TextField
            key={field}
            fullWidth
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            margin="normal"
            required
            multiline={field === 'description'}
            rows={field === 'description' ? 3 : 1}
          />
        ))}

        <Typography gutterBottom>Estimated Footfall</Typography>
        <Slider
          value={formData.footfall}
          onChange={handleFootfallChange}
          min={100}
          max={10000}
          step={100}
          valueLabelDisplay="auto"
        />

        <TextField
          select
          fullWidth
          label="Footfall Type"
          name="footfallType"
          value={formData.footfallType}
          onChange={handleChange}
          margin="normal"
        >
          {['Daily', 'Weekly', 'Monthly'].map((type) => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </TextField>

        <TextField
          type="number"
          fullWidth
          label="Monthly Pricing"
          name="pricing.monthly"
          value={formData.pricing.monthly}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          type="number"
          fullWidth
          label="Weekly Pricing (Optional)"
          name="pricing.weekly"
          value={formData.pricing.weekly}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          type="date"
          fullWidth
          label="Availability Start Date (Optional)"
          name="availability.startDate"
          value={formData.availability.startDate}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          type="date"
          fullWidth
          label="Availability End Date (Optional)"
          name="availability.endDate"
          value={formData.availability.endDate}
          onChange={handleChange}
          margin="normal"
        />

        <Dropzone onDrop={handleFileDrop} accept="image/*">
          {({ getRootProps, getInputProps }) => (
            <Box {...getRootProps()} sx={{ border: '2px dashed gray', padding: 3, textAlign: 'center', cursor: 'pointer', mt: 2 }}>
              <input {...getInputProps()} />
              <Typography>Drag & Drop images here, or click to select files</Typography>
            </Box>
          )}
        </Dropzone>

        <Box mt={2}>
          {formData.images.length > 0 ? (
            <Grid container spacing={1}>
              {formData.images.map((file, index) => (
                <Grid item key={index}>
                  <Card sx={{ maxWidth: 150 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={URL.createObjectURL(file)}
                      alt={file.name}
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {file.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No images selected</Typography>
          )}
        </Box>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
          Submit Property
        </Button>
      </form>
    </Container>
  );
};

export default AddProperty;