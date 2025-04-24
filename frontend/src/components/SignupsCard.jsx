import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
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
            const response = await axios.get("/api/statistics");
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

            setUniqueSignups(response.data.uniqueSignups);
        } catch (error) {
            console.error("Error fetching signups data:", error);
        }
    };

    useEffect(() => {
        fetchSignupsData();
    }, []);

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
            </CardContent>
        </Card>
    );
};

export default SignupsCard;
