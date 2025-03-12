import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import { AuthContext } from '../context/AuthContext';
import logo from '/src/assets/reTreatLogo.png';
import Grow from '@mui/material/Grow';
import Collapse from '@mui/material/Collapse';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [navAnchor, setNavAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const [menuItemsVisible, setMenuItemsVisible] = useState([false, false, false]);
  const navigate = useNavigate();

  const handleOpenNav = (event) => setNavAnchor(event.currentTarget);
  const handleCloseNav = () => setNavAnchor(null);
  const handleOpenUser = (event) => setUserAnchor(event.currentTarget);
  const handleCloseUser = () => {
    setMenuItemsVisible([false, false, false]);
    setTimeout(() => setUserAnchor(null), 250);
  };

  useEffect(() => {
    if (userAnchor) {
      setMenuItemsVisible([false, false, false]);
      setTimeout(() => setMenuItemsVisible([true, false, false]), 50);
      setTimeout(() => setMenuItemsVisible([true, true, false]), 100);
      setTimeout(() => setMenuItemsVisible([true, true, true]), 150);
    }
  }, [userAnchor]);

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Our Menu', path: '/menu' },
    { name: 'Our Team', path: '/meet-the-team' },
    { name: 'Book Appointment', path: '/appointment' },
    { name: 'FAQ', path: '/faq' },
    { name: 'About us', path: '/about-us' },
    { name: 'Contact Us', path: '/contact-us' }
  ];

  const employeePages = user?.role === 'employee' ? [{ name: 'Manage Schedule', path: '/employee-schedule' }] : [];
  const allPages = [...pages, ...employeePages];

  const profileImageUrl = user && user.profilePicture 
    ? `http://localhost:5000${user.profilePicture}?t=${Date.now()}`
    : 'https://via.placeholder.com/120';

  return (
    <AppBar position="static" color="secondary">
      <Container maxWidth="false">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box component={Link} to="/" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', textDecoration: 'none', ml: 2, mr: 1 }}>
            <img src={logo} alt="Logo" style={{ height: 40 }} />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" aria-label="Current Users Account" aria-controls="menu-navbar" aria-haspopup="true" onClick={handleOpenNav} color="primary">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-navbar2"
              anchorEl={navAnchor}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(navAnchor)}
              onClose={handleCloseNav}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNav} component={Link} to={page.path}>
                  <Typography>{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', flexGrow: 1, textAlign: 'center' }}>
            {allPages.map((page) => (
              <Button key={page.name} component={Link} to={page.path} sx={{ my: 2, color: 'white', px: 2.25, mx: 1 }}>
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            {user ? (
              <>
                <IconButton onClick={() => navigate('/cart')} sx={{ color: 'white', mr: 2 }}>
                  <Badge>
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>

                <Tooltip title="Open Account Options">
                  <IconButton onClick={handleOpenUser} sx={{ p: 0, mr: 2 }}>
                    <Avatar alt={user.name} src={profileImageUrl} sx={{ width: 40, height: 40 }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '10px' }}
                  id="menu-navbar"
                  anchorEl={userAnchor}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                  open={Boolean(userAnchor)}
                  onClose={handleCloseUser}
                >
                  <Collapse in={menuItemsVisible[0]} timeout={400}>
                    <MenuItem onClick={() => navigate('/profile')}>
                      <Typography>Profile</Typography>
                    </MenuItem>
                  </Collapse>

                  <Collapse in={menuItemsVisible[1]} timeout={400}>
                    <MenuItem onClick={() => navigate('/account-settings')}>
                      <Typography>Account Settings</Typography>
                    </MenuItem>
                  </Collapse>

                  <Collapse in={menuItemsVisible[2]} timeout={400}>
                    <MenuItem onClick={logout}>
                      <Typography>Log Out</Typography>
                    </MenuItem>
                  </Collapse>
                </Menu>
              </>
            ) : (
              <Box>
                <Button component={Link} to="/login" sx={{ color: 'white' }}>
                  Login
                </Button>
                <Button component={Link} to="/register" sx={{ color: 'white' }}>
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
