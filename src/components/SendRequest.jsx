import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Paper } from '@mui/material';

const SendRequest = ({ propertyId }) => {
  const [formData, setFormData] = useState({
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ property: propertyId, message: formData.message }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Send Advertisement Request
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Send Request
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default SendRequest;