import React, {useState} from 'react';
import {Typography,  Box} from '@mui/material';
// import VisitsCard from "../../components/VisitsCard";
import SignupsCard from "../../components/SignupsCard";
import WebsiteVisitsCard from "../../components/WebsiteVisitsCard";


const StatisticsSection = () => {
    return (<Box>
 <Typography variant="h5" sx={{ fontWeight: 'bold' }}  xs={12} sm={6} md={4} p={5}>
                    Admin Dashboard
        <Box sx={styles.columnContainer}>
        <SignupsCard sx ={styles.item} />
        <WebsiteVisitsCard sx = {styles.item} />

        </Box>
 </Typography>    
 </Box>)
}

export default StatisticsSection;

const styles={
    columnContainer:{
        columns: '280px 2',
        maxWidth: 2500
    },
    item:{
        mb: 2
    },
}
