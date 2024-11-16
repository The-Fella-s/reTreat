import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, CssBaseline } from '@mui/material';
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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            paddingTop: 4,
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem button onClick={() => handleNavigation('statistics')}>
            <ListItemText primary="Statistics" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('employee')}>
            <ListItemText primary="Employee Section" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('user')}>
            <ListItemText primary="User Section" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('menu')}>
            <ListItemText primary="Menu Section" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('booking')}>
            <ListItemText primary="Booking Section" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('theme')}>
            <ListItemText primary="Theme Section" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          padding: 3,
          marginLeft: 240,
          marginTop: 8,
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
