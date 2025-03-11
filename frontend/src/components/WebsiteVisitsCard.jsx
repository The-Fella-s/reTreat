import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import axios from "axios";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const WebsiteVisitsCard = () => {
    const [visitsData, setVisitsData] = useState({
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        datasets: [
            {
                label: "Website Visits",
                data: [0, 0, 0, 0, 0, 0, 0], // Default values
                borderColor: "orange",
                fill: false,
                tension: 0.4,
            }
        ]
    });

    const [totalVisits, setTotalVisits] = useState(0);

    // Fetch real visit data from MongoDB
    const fetchVisitsData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/website-visits/get");
            console.log("Website Visits API response:", response.data);

            const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const values = labels.map(day => response.data.dailyVisits?.[day] || 0); // Get real visit counts

            setVisitsData({
                labels,
                datasets: [
                    {
                        label: "Website Visits",
                        data: values,
                        borderColor: "orange",
                        fill: false,
                        tension: 0.4,
                    }
                ]
            });

            setTotalVisits(response.data.totalVisits);
        } catch (error) {
            console.error("Error fetching website visits data:", error);
        }
    };

    useEffect(() => {
        fetchVisitsData();
    }, []);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">
                    Total Website Visits: {totalVisits}
                </Typography>
                <Line
                    data={visitsData}
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

export default WebsiteVisitsCard;
