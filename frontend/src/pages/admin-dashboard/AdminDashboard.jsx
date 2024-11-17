import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Button, Typography, CssBaseline } from '@mui/material';
import { Route, Routes, useNavigate } from 'react-router-dom';

// Import section components
import EmployeeSection from './EmployeeSection';
import UserSection from './UserSection';
import MenuSection from './MenuSection';
import BookingSection from './BookingSection';
import StatisticsSection from './StatisticsSection';
import ThemeSection from './ThemeSection';

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState('statistics');
  const navigate = useNavigate();

  const handleNavigation = (section) => {
    setSelectedSection(section);
    navigate(`/admin-dashboard/${section}`);
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <CssBaseline />

      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: '#00ACC1' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          {/* Add user profile, logout, or other icons here if needed */}
        </Toolbar>
      </AppBar>

      {/* Horizontal Menu Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
          paddingY: 1,
          boxShadow: 1,
        }}
      >
        <Button
          onClick={() => handleNavigation('statistics')}
          variant={selectedSection === 'statistics' ? 'contained' : 'text'}
          sx={{ marginX: 1 }}
        >
          Statistics
        </Button>
        <Button
          onClick={() => handleNavigation('employee')}
          variant={selectedSection === 'employee' ? 'contained' : 'text'}
          sx={{ marginX: 1 }}
        >
          Employee Section
        </Button>
        <Button
          onClick={() => handleNavigation('user')}
          variant={selectedSection === 'user' ? 'contained' : 'text'}
          sx={{ marginX: 1 }}
        >
          User Section
        </Button>
        <Button
          onClick={() => handleNavigation('menu')}
          variant={selectedSection === 'menu' ? 'contained' : 'text'}
          sx={{ marginX: 1 }}
        >
          Menu Section
        </Button>
        <Button
          onClick={() => handleNavigation('booking')}
          variant={selectedSection === 'booking' ? 'contained' : 'text'}
          sx={{ marginX: 1 }}
        >
          Booking Section
        </Button>
        <Button
          onClick={() => handleNavigation('theme')}
          variant={selectedSection === 'theme' ? 'contained' : 'text'}
          sx={{ marginX: 1 }}
        >
          Theme Section
        </Button>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          padding: 3,
          bgcolor: 'background.default',
          flexGrow: 1,
          minHeight: 'calc(100vh - 64px - 48px)', // Adjust for navbar and menu bar height
        }}
      >
        <Routes>
          <Route path="statistics" element={<StatisticsSection />} />
          <Route path="employee" element={<EmployeeSection />} />
          <Route path="user" element={<UserSection />} />
          <Route path="menu" element={<MenuSection />} />
          <Route path="booking" element={<BookingSection />} />
          <Route path="theme" element={<ThemeSection />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
