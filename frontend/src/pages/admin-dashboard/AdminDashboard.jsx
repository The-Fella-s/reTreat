import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Button, Typography, CssBaseline, IconButton, Menu, MenuItem, Hidden } from '@mui/material';
import { Route, Routes, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PropTypes from "prop-types";

// Import section components
import EmployeeSection from './EmployeeSection';
import UserSection from './UserSection';
import MenuSection from './MenuSection';
import BookingSection from './BookingSection';
import StatisticsSection from './StatisticsSection';
import ThemeSection from './ThemeSection';

const AdminDashboard = ({ setTheme }) => {
  const [selectedSection, setSelectedSection] = useState('statistics');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = (section) => {
    setSelectedSection(section);
    navigate(`/admin-dashboard/${section}`);
    setAnchorEl(null); 
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: 'Statistics', section: 'statistics' },
    { label: 'Employee Section', section: 'employee' },
    { label: 'User Section', section: 'user' },
    { label: 'Menu Section', section: 'menu' },
    { label: 'Booking Section', section: 'booking' },
    { label: 'Theme Section', section: 'theme' },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <CssBaseline />

      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: '#00ACC1' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Hidden mdUp>
            <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {menuItems.map((item) => (
                <MenuItem key={item.section} onClick={() => handleNavigation(item.section)}>
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Hidden>
          <Hidden mdDown>
            {menuItems.map((item) => (
              <Button
                key={item.section}
                onClick={() => handleNavigation(item.section)}
                variant={selectedSection === item.section ? 'contained' : 'text'}
                sx={{ marginX: 1 }}
              >
                {item.label}
              </Button>
            ))}
          </Hidden>
        </Toolbar>
      </AppBar>

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
          <Route path="theme" element={<ThemeSection setTheme={setTheme} />} />
        </Routes>
      </Box>
    </Box>
  );
};

AdminDashboard.propTypes = {
  setTheme: PropTypes.func.isRequired, // Function to set the theme
};

export default AdminDashboard;
