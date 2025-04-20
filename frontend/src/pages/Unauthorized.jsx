import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#f5f5f5",
                textAlign: "center",
                p: 4,
            }}
        >
            <Typography variant="h3" color="error" gutterBottom>
                Unauthorized
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>
                You do not have permission to view this page.
            </Typography>
            <Button variant="contained" onClick={() => navigate("/")}>
                Go to Home
            </Button>
        </Box>
    );
};

export default Unauthorized;
