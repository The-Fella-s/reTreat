import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import Collapse from '@mui/material/Collapse';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [navAnchor, setNavAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const [menuItemsVisible, setMenuItemsVisible] = useState([false, false, false]);
  const navigate = useNavigate();
  const location = useLocation();

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
    { name: 'Contact Us', path: '/contact-us' },
    { name: 'Waiver', path: '/waiver' }  
  ];

  const allPages = [...pages];

  const profileImageUrl = user?.profilePicture
    ? `http://localhost:5000${user.profilePicture}?t=${Date.now()}`
    : 'https://via.placeholder.com/120';

  return (
    <AppBar position="static" color="secondary">
      <Container maxWidth="false">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              textDecoration: 'none',
              ml: 2,
              mr: 1,
            }}
          >
            <img src={logo} alt="Logo" style={{ height: 40 }} />
          </Box>

          {/* Mobile Nav */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" onClick={handleOpenNav} color="primary">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-navbar-mobile"
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

          {/* Desktop Nav Links */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              flexGrow: 1,
              textAlign: 'center',
            }}
          >
            {allPages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                sx={{ my: 2, color: 'white', px: 2.25, mx: 1 }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Right side */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            {/* Cart Icon always visible */}
            <IconButton onClick={() => navigate('/cart')} sx={{ color: 'white', mr: 2 }}>
              <Badge>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {user ? (
              <>
                <Tooltip title="Open Account Options">
                  <IconButton onClick={handleOpenUser} sx={{ p: 0, mr: 2 }}>
                    <Avatar alt={user.name} src={profileImageUrl} sx={{ width: 40, height: 40 }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="menu-user-dropdown"
                  anchorEl={userAnchor}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(userAnchor)}
                  onClose={handleCloseUser}
                  sx={{ mt: '10px' }}
                >
                  <Collapse in={menuItemsVisible[0]} timeout={400}>
                    <MenuItem onClick={() => navigate('/profile')}>
                      <Typography>Profile</Typography>
                    </MenuItem>
                  </Collapse>


                  {user?.role === 'admin' && (
                    <Collapse in={menuItemsVisible[1]} timeout={400}>
                      <MenuItem onClick={() => navigate('/dashboard')}>
                        <Typography>Dashboard</Typography>
                      </MenuItem>
                    </Collapse>
                  )}


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
