
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

import { VisitsData } from './VisitsData';
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

const VisitsCard = () => {
    const options ={};
    return ( <Card>
        <CardContent>
            <Typography variant = "cardTitle">
                Visit Statistics
            </Typography>
       
           <Line options={options} data = {VisitsData}/>
           
            <Box sx={styles.container}>

            </Box>
        </CardContent>
    </Card>

    )
  

}

export default VisitsCard;

const styles = {
    container: {
        width: '100%',
        position: 'relative'
    },
}
