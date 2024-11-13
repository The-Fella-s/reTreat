import React, {useState} from 'react';
import {Typography, Grid2, Button, Box} from '@mui/material';
import {formatDuration} from '../utilities/formatDuration.js';
import services from '../temporarydata/Services.jsx';
import {useNavigate} from 'react-router-dom';
import VisitsCard from '../components/VisitsCard.jsx';
import SignupsCard from '../components/SignupsCard.jsx';

const Dashboard = () => {
    return (<Box>
 <Typography variant="h5" sx={{ fontWeight: 'bold' }}  xs={12} sm={6} md={4} p={5}>
                    Admin Dashboard
        <Box sx={styles.columnContainer}>
        <VisitsCard sx ={styles.item} />
        <SignupsCard sx ={styles.item} />
        </Box>
 </Typography>    
 </Box>)
}

export default Dashboard;

const styles={
    columnContainer:{
        columns: '280px 3',
        maxWidth: 1400
    },
    item:{
        mb: 2
    },
}