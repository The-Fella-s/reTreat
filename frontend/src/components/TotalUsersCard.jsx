
import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from 'axios';

    const TotalUsersCard = () => {
        const [totalUsers, setTotalUsers] = useState(0);
    
        useEffect(() => {
            const fetchTotalUsers = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/statistics/fetch');
                    setTotalUsers(response.data.totalUsers);
                } catch (error) {
                    console.error('Error fetching total users:', error);
                }
            };
    
            fetchTotalUsers();
        }, []);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">
                    Total Users: {totalUsers}
                </Typography>
                  <Typography variant='body2' sx={{ color: 'text.secondary', }}>
                    {totalUsers} users have registered on the platform.
                    </Typography>
            </CardContent>
        </Card>
    );
};

export default TotalUsersCard;