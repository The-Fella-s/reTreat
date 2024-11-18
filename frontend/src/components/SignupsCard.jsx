import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, CardMedia } from '@mui/material';
import PropTypes from 'prop-types';

import { SignupsData } from './SignupsData';
import{Line} from 'react-chartjs-2';
import{Chart as ChartJS,
       CategoryScale,
       LinearScale,
       PointElement,
       LineElement,
       Title,
       Tooltip,
       Legend
} from 'chart.js';

ChartJS.register( 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SignupsCard = () => {
    const options ={};
    const data = {};
    return ( <Card>
        <CardContent>
            <Typography variant = "cardTitle">
                Unique Signups
            </Typography>
       
           <Line options={options} data = {SignupsData}/>
           
            <Box sx={styles.container}>

            </Box>
        </CardContent>
    </Card>

    )
  

}

export default SignupsCard;

const styles = {
    container: {
        width: '100%',
        position: 'relative'
    },
}
