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
import PropertyDetails from './components/PropertyDetails';

// Wrapper to handle navigation inside Login
function LoginWithNavigate({ onLoginSuccess }) {
  const navigate = useNavigate();
  return <Login onLoginSuccess={() => onLoginSuccess()} />;
}

// Wrapper to pass role to Dashboard and BrowseProperties
function DashboardWithRole({ role }) {
  return <Dashboard role={role} />;
}

function BrowsePropertiesWithRole({ role }) {
  return <BrowseProperties role={role} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginWithNavigate onLoginSuccess={() => navigate('/dashboard')} />} />
        <Route path="/dashboard" element={<DashboardWithRole role={localStorage.getItem('role')} />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/browse-properties" element={<BrowsePropertiesWithRole role={localStorage.getItem('role')} />} />
        <Route path="/property/:id" element={<PropertyDetails role={localStorage.getItem('role')} />} />
      </Routes>
    </Router>
  </ThemeProvider>
);