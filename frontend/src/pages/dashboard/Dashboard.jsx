import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useMediaQuery,
  IconButton,
  AppBar,
  Toolbar
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Layers as LayersIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import PropTypes from "prop-types";

import StatisticsSection from "./StatisticsSection.jsx";
import EmployeeSection from "./EmployeeSection.jsx";
import UserSection from "./UserSection.jsx";
import BookingSection from "./BookingSection.jsx";
import ThemeSection from "./ThemeSection.jsx";
import jwt_decode from "jwt-decode";

// Value for the drawer's width
const drawerWidth = 220;

function Dashboard({ setTheme }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = "/dashboard";

  // Checks for admin privileges
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/unauthorized");

    try {
      const decoded = jwt_decode(token);
      if (decoded?.role !== "admin") navigate("/unauthorized");
    } catch {
      navigate("/unauthorized");
    }
  }, [navigate]);

  const handleDrawerToggle = () => setMobileOpen(prev => !prev);

  const isActive = path =>
    location.pathname === `${basePath}/${path}` ||
    location.pathname.startsWith(`${basePath}/${path}/`) ||
    (path === "" && (location.pathname === basePath || location.pathname === `${basePath}/`));

  const menuItems = [
    { text: "Overview", icon: <DashboardIcon />, path: "" },
    { text: "Employees", icon: <PeopleIcon />, path: "employees" },
    { text: "Users", icon: <PeopleIcon />, path: "users" },
    { text: "Bookings", icon: <BarChartIcon />, path: "booking" },
    { text: "Themes", icon: <LayersIcon />, path: "themes" }
  ];

  const drawerContent = (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map(({ text, icon, path }) => {
          const active = isActive(path);
          return (
            <ListItem key={text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={path ? `${basePath}/${path}` : basePath}
                selected={active}
                onClick={isMobile ? handleDrawerToggle : undefined}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? "primary.light" : "transparent",
                  color: active ? "primary.contrastText" : "inherit",
                  "&.Mui-selected, &.Mui-selected:hover": {
                    bgcolor: "primary.light",
                    color: "primary.contrastText"
                  },
                  "&:hover": {
                    bgcolor: active ? "primary.light" : "action.hover"
                  }
                }}
              >
                <ListItemIcon sx={{ color: active ? "primary.contrastText" : "inherit", minWidth: 40 }}>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} primaryTypographyProps={{ fontWeight: active ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {isMobile ? (
        <>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{ "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
          >
            {drawerContent}
          </Drawer>

          <AppBar position="static" sx={{ bgcolor: "#00ACC1" }}>
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Dashboard
              </Typography>
              <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
            <Routes>
              <Route path="/" element={<StatisticsSection />} />
              <Route path="employees" element={<EmployeeSection />} />
              <Route path="users" element={<UserSection />} />
              <Route path="booking" element={<BookingSection />} />
              <Route path="themes" element={<ThemeSection setTheme={setTheme} />} />
            </Routes>
          </Box>
        </>
      ) : (
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <Box sx={{ width: drawerWidth, flexShrink: 0, borderRight: "1px solid", borderColor: "divider" }}>
            {drawerContent}
          </Box>
          <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
            <Routes>
              <Route path="/" element={<StatisticsSection />} />
              <Route path="employees" element={<EmployeeSection />} />
              <Route path="users" element={<UserSection />} />
              <Route path="booking" element={<BookingSection />} />
              <Route path="themes" element={<ThemeSection setTheme={setTheme} />} />
            </Routes>
          </Box>
        </Box>
      )}
    </Box>
  );
}

Dashboard.propTypes = {
  setTheme: PropTypes.func.isRequired
};

export default Dashboard;