import React from 'react';
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
import logo from '/src/assets/reTreatLogo.png';

const pages = [
    { name: 'Home', path: '/' },
    { name: 'Our Menu', path: '/menu' },
    { name: 'Our Team', path: '/meet-the-team' },
    { name: 'Book Appointment', path: '/appointment' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact Us', path: '/contact-us' }
];

const settings = ['Profile', 'Account', 'Appointments', 'Settings', 'Sign Out'];

function NavBar() {
    const [navAnchor, setNavAnchor] = React.useState(null);
    const [userAnchor, setUserAnchor] = React.useState(null);

    const handleOpenNav = (event) => {
        setNavAnchor(event.currentTarget);
    };

    const handleCloseNav = () => {
        setNavAnchor(null);
    };

    const handleOpenUser = (event) => {
        setUserAnchor(event.currentTarget);
    };

    const handleCloseUser = () => {
        setUserAnchor(null);
    };

    return (
        <AppBar position="static" color = "secondary">
            <Container maxWidth="lx1">
                <Toolbar disableGutters>
                    {/* Logo with Link to Home */}
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            textDecoration: 'none',
                        }}
                    >
                        <img src={logo} alt="reTreat Salon&Spa Logo" style={{ height: 40 }} />
                    </Box>

                    {/* Mobile Menu Icon */}
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
                            id="menu-navbar"
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
                                    <Typography sx={{ textAlign: 'center' }}>{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Logo for Mobile View */}
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 50,
                            justifyContent: 'left',
                            textDecoration: 'none',
                        }}
                    >
                        <img src={logo} alt="reTreat Salon&Spa Logo" style={{ height: 40 }} />
                    </Box>

                    {/* Desktop Navigation Buttons, Aligned to the Right */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', flexGrow: 1 }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                component={Link}
                                to={page.path}
                                onClick={handleCloseNav}
                                sx={{ my: 2, color: 'white', display: 'grid', px: 2.25 }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {/* User Avatar, Statically Positioned */}
                    <Box sx={{ flexGrow: 0.02 }}>
                        <Tooltip title="Open Account Options">
                            <IconButton onClick={handleOpenUser} sx={{ p: 0 }}>
                                <Avatar alt="Name Here" src="/src/assets/StockImage.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-navbar"
                            anchorEl={userAnchor}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={Boolean(userAnchor)}
                            onClose={handleCloseUser}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUser}>
                                    <Typography sx={{ textAlign: 'center', color: 'black' }}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;
