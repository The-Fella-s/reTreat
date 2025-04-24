import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
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
                data: [0, 0, 0, 0, 0, 0, 0],
                borderColor: "orange",
                fill: false,
                tension: 0.4,
            }
        ]
    });

    const [totalVisits, setTotalVisits] = useState(0);

    const fetchVisitsData = async () => {
        try {
            const response = await axios.get("/api/website-visits/get");
            const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const values = labels.map(day => response.data.dailyVisits?.[day] || 0);

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

    const handleResetVisits = async () => {
        try {
            await axios.post("/api/website-visits/reset");
            await fetchVisitsData(); // Refresh chart
            alert("Website visits have been reset.");
        } catch (error) {
            console.error("Error resetting visits:", error);
            alert("Failed to reset website visits.");
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

                <Button
                    variant="contained"
                    color= 'error'
                    sx={{ mt: 2 }}
                    onClick={handleResetVisits}
                >
                    Reset Website Visits
                </Button>
            </CardContent>
        </Card>
    );
};

export default WebsiteVisitsCard;
