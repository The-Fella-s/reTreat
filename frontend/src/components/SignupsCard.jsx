import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

import {
    Chart as ChartJS,
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
    const [signupsData, setSignupsData] = useState({
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        datasets: [
            {
                label: "Signups",
                data: [0, 0, 0, 0, 0, 0, 0], // Default values
                borderColor: "green",
                fill: false,
                tension: 0.4,
            }
        ]
    });

    const [uniqueSignups, setUniqueSignups] = useState(0); // Tracks total unique signups

    // Fetch sign-up data from MongoDB
    const fetchSignupsData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/statistics");
            console.log("Signups API response:", response.data);
    
            const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const values = labels.map(day => response.data.dailySignups?.[day] || 0); // Extract daily signups
    
            console.log("Processed labels:", labels);
            console.log("Processed values:", values);
    
            setSignupsData({
                labels,
                datasets: [
                    {
                        label: "Signups",
                        data: values,
                        borderColor: "green",
                        fill: false,
                        tension: 0.4,
                    }
                ]
            });
        } catch (error) {
            console.error("Error fetching signups data:", error);
        }
    };

    // Fetch unique signup count
    const fetchUniqueSignups = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/statistics");
            console.log("Unique signups count received:", response.data.uniqueSignups);
            setUniqueSignups(response.data.uniqueSignups);
        } catch (error) {
            console.error("Error fetching unique signups count:", error);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchSignupsData();
        fetchUniqueSignups();
    }, []);

    // Function to handle a new signup
    const handleSignup = async () => {
        try {
            await axios.post("http://localhost:5000/api/statistics/update-signups");

            fetchSignupsData(); // Refresh chart after sign-up
            fetchUniqueSignups(); // Refresh unique signups count
        } catch (error) {
            console.error("Error adding signup:", error.response ? error.response.data : error);
        }
    };

    // Function to reset all signup data
    const handleResetSignups = async () => {
        try {
            await axios.post("http://localhost:5000/api/statistics/reset-signups");
            fetchSignupsData(); // Refresh chart after reset
            fetchUniqueSignups(); // Refresh count
        } catch (error) {
            console.error("Error resetting signups:", error.response ? error.response.data : error);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">
                    Unique Signups: {uniqueSignups}
                </Typography>
                <Line 
                    data={signupsData} 
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: "top",
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }}
                />
                <Box sx={styles.container}>
                    <Button variant="contained" color="primary" onClick={handleSignup}>
                        Simulate Sign-up
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleResetSignups} sx={{ marginLeft: 2 }}>
                        Reset Signups
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default SignupsCard;

const styles = {
    container: {
        width: '100%',
        position: 'relative',
        marginTop: '20px',
        display: 'flex',
        gap: '10px'
    },
};
