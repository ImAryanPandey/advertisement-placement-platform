import React from 'react';
import { Typography, Container, Paper, Grid, Avatar } from '@mui/material';

const Profile = ({ user }) => {
  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
        <Avatar alt={user.name} src="/static/images/avatar/1.jpg" sx={{ width: 100, height: 100, margin: '0 auto 1rem' }} />
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">Name: {user.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Email: {user.email}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;