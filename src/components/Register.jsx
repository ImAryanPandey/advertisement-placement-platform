import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Paper, Grid, Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';

const Register = ({ setRole, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'owner',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setRole(formData.role);
        onRegisterSuccess();
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormLabel id="demo-radio-buttons-group-label">Choose Your Role</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-radio-buttons-group-label"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <FormControlLabel value="owner" control={<Radio />} label="Property Owner" />
            <FormControlLabel value="business" control={<Radio />} label="Business" />
          </RadioGroup>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;