import React, { useState } from 'react';
import { Typography, Container, Paper, Grid, Avatar, TextField, Button, CircularProgress } from '@mui/material';

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar || '/static/images/avatar/1.jpg',
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    if (!profileData.name || !profileData.email) {
      setError('Name and Email cannot be empty!');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (data.success) {
        setEditing(false);
      } else {
        setError('Failed to update profile. Try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData({ ...profileData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
        <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} id="avatar-upload" />
        <label htmlFor="avatar-upload">
          <Avatar alt={profileData.name} src={profileData.avatar} sx={{ width: 100, height: 100, margin: '0 auto 1rem', cursor: 'pointer' }} />
        </label>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Role: {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}</Typography>
          </Grid>
          <Grid item xs={12}>
            {editing ? (
              <Button variant="contained" color="primary" onClick={handleSave} fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Save'}
              </Button>
            ) : (
              <Button variant="outlined" color="primary" onClick={handleEdit} fullWidth>
                Edit Profile
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;