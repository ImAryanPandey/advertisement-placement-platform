import React, { useState, useEffect } from 'react';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Box, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Profile from './components/Profile';

function App() {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/auth', {
            method: 'GET',
            headers: {
              'x-auth-token': token,
            },
          });
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
            setRole(data.user.role);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
          navigate('/');
        }
      };
      verifyToken();
    }
  }, [navigate]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setRole(null);
    navigate('/');
  };

  const handleRegisterSuccess = () => {
    navigate('/dashboard');
  };

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Advertisement Placement Platform
          </Typography>
          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {!user ? (
          <Register setRole={setRole} onRegisterSuccess={handleRegisterSuccess} />
        ) : (
          <>
            <Profile user={user} />
            <Box sx={{ mt: 4 }}>
              {role === 'owner' ? (
                <Button variant="contained" color="primary" href="/add-property" sx={{ mb: 2 }}>
                  Add Property
                </Button>
              ) : null}
              {role === 'business' ? (
                <Button variant="contained" color="secondary" href="/browse-properties" sx={{ mb: 2 }}>
                  Browse Properties
                </Button>
              ) : null}
              <Link href="/dashboard" underline="none">
                <Button variant="outlined" color="primary">
                  Go to Dashboard
                </Button>
              </Link>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Recent Activity
              </Typography>
              {/* Placeholder for recent activity */}
              <Typography variant="body1">No recent activity.</Typography>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}

export default App;