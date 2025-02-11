import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
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

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [navAnchor, setNavAnchor] = React.useState(null);
  const [userAnchor, setUserAnchor] = React.useState(null);

  const handleOpenNav = (event) => setNavAnchor(event.currentTarget);
  const handleCloseNav = () => setNavAnchor(null);
  const handleOpenUser = (event) => setUserAnchor(event.currentTarget);
  const handleCloseUser = () => setUserAnchor(null);

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Our Menu', path: '/menu' },
    { name: 'Our Team', path: '/meet-the-team' },
    { name: 'Book Appointment', path: '/appointment' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact Us', path: '/contact-us' },
  ];

  return (
    <AppBar position="static" color="secondary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', textDecoration: 'none', mr: 2 }}
          >
            <img src={logo} alt="Logo" style={{ height: 40 }} />
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="Current Users Account"
              aria-controls="menu-navbar"
              aria-haspopup="true"
              onClick={handleOpenNav}
              color="inherit"
            >
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

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', flexGrow: 1 }}>
            {pages.map((page) => (
              <Button key={page.name} component={Link} to={page.path} sx={{ my: 2, color: 'white', px: 2.25 }}>
                {page.name}
              </Button>
            ))}
          </Box>

          {/* User Avatar or Login/Register */}
          <Box sx={{ flexGrow: 0.02 }}>
            {user ? (
              <>
                <Tooltip title="Open Account Options">
                  <IconButton onClick={handleOpenUser} sx={{ p: 0 }}>
                    <Avatar alt={user.name} src={user.profilePicture || ''} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-navbar"
                  anchorEl={userAnchor}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(userAnchor)}
                  onClose={handleCloseUser}
                >
                  <MenuItem onClick={logout}>
                    <Typography>Logout</Typography>
                  </MenuItem>
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
