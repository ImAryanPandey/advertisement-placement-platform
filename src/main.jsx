import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import theme from './theme';
import './App.css';
import App from './App';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddProperty from './components/AddProperty';
import BrowseProperties from './components/BrowseProperties';

// Wrapper to handle navigation inside Login
function LoginWithNavigate() {
  const navigate = useNavigate();
  return <Login onLoginSuccess={() => navigate('/dashboard')} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginWithNavigate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/browse-properties" element={<BrowseProperties />} />
      </Routes>
    </Router>
  </ThemeProvider>
);
