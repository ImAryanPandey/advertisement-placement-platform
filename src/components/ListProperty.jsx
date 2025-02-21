import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Paper, InputLabel, OutlinedInput, InputAdornment, IconButton, FormControl, FormHelperText, Grid } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ListProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    dimensions: '',
    address: '',
    landmarks: '',
    expectedTraffic: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleChange = (e) => {
    if (e.target.name === 'images') {
      setFormData({ ...formData, [e.target.name]: e.target.files });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
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
      console.log(data);
    } catch (error) {
      console.error('Error listing property:', error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          List Your Property
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel htmlFor="images">Images</InputLabel>
            <OutlinedInput
              inputProps={{
                accept: 'image/*',
              }}
              input={<input id="images" type="file" multiple />}
              onChange={handleChange}
              name="images"
              required
            />
            <FormHelperText>
              Upload images of your property
            </FormHelperText>
          </FormControl>
          <TextField
            label="Dimensions"
            variant="outlined"
            fullWidth
            margin="normal"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            required
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            margin="normal"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <TextField
            label="Landmarks"
            variant="outlined"
            fullWidth
            margin="normal"
            name="landmarks"
            value={formData.landmarks}
            onChange={handleChange}
          />
          <TextField
            label="Expected Traffic"
            variant="outlined"
            fullWidth
            margin="normal"
            name="expectedTraffic"
            value={formData.expectedTraffic}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            List Property
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ListProperty;