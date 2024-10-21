import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

const pages = ['Home', 'Our Menu', 'Our Team', 'Book Appointment', 'FAQ', 'Contact Us'];
const settings = ['Profile', 'Account', 'Appointments','Settings','Sign Out'];

function NavBar(){
    const [navAnchor, setNavAnchor] = React.useState(null);
    const [userAnchor, setUserAnchor] = React.useState(null);

    const handleOpenNav = (event) =>{
        setNavAnchor(event.currentTarget);
    };

    const handleCloseNav = () => {
        setNavAnchor(null);
    };

    const handleOpenUser = (event) =>{
        setUserAnchor(event.currentTarget);
    };

    const handleCloseUser = () =>{
        setUserAnchor(null);
    };

    return(
        <AppBar position = "static">
            <Container maxWidth="lx1">
                <Toolbar disableGutters>
                    <Typography
                    variant='h5'
                    noWrap component= 'a'
                    href="#nav-bar"
                    sx={{
                        mr:2,
                        display: {xs: 'none', md: 'flex'},
                        fontFamily: 'Helvetica',
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        color: 'white',
                        textDecoration: 'none'
                    }}
                    >
                        reTreat Salon&Spa
                    </Typography>
                    <Box sx = {{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                        size = "large"
                        aria-label = "Current Users Account"
                        aria-controls='menu-navbar'
                        aria-haspopup="true"
                        onClick={handleOpenNav}
                        color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                        id = "menu-navbar"
                        anchorEl = {navAnchor}
                        anchorOrigin = {{vertical: 'bottom', horizontal: 'left'}}
                        keepMounted transformOrigin = {{vertical: 'top', horizontal: 'left'}}
                        open = {Boolean(navAnchor)}
                        onClose = {handleCloseNav}
                        sx = {{display: {xs: 'block', md: 'none'}}}
                        >
                            {pages.map((page) => (
                                <MenuItem key = {page} onClick={handleCloseNav}>
                                    <Typography sx = {{textAlign: 'right'}}>{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                    variant = "h5"
                    noWrap component= "a"
                    href = "#nav-bar"
                    sx = {{
                        mr: 2,
                        display: {xs: 'flex', md: 'none'},
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: ".3rem",
                        color: "inherit",
                        textDecoration: 'none'
                    }}
                    >
                    Logo
                    </Typography>
                    <Box sx = {{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Button
                                key = {page}
                                onClick = {handleCloseNav}
                                sx = {{my: 2, color: 'white', display: 'block'}}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <Box sx = {{flexGrow: .15}}>
                        <Tooltip title = "Open Account Options">
                            <IconButton onClick = {handleOpenUser} sx = {{p: 0}}>
                                <Avatar alt="Name Here" src = "/src/assets/StockImage.jpg"/>
                            </IconButton>
                        </Tooltip>
                        <Menu 
                        sx = {{mt: '45px'}}
                        id = "menu-navbar"
                        anchorEl = {userAnchor}
                        anchorOrigin = {{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        open = {Boolean(userAnchor)}
                        onClose = {handleCloseUser}
                        >
                            {settings.map((setting) => (
                                <MenuItem key = {setting} onClick={handleCloseUser}> 
                                    <Typography sx = {{textAlign: 'center', color: 'black'}}>{setting}</Typography>
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