// components/ReadyRelax.jsx
import React from "react";
import { Button, Box, Typography } from "@mui/material";

const ReadyToRelax = () => {
	return (
		<Box
			sx={{
				backgroundColor: "#f0f0f0", // Gray background
				padding: "20px",
				textAlign: "center",
				marginTop: "20px",
			}}
		>
			<Typography
				variant="h4"
				component="h2"
				gutterBottom
				sx={{ fontFamily: "Special Elite" }}
			>
				Ready to Relax?
			</Typography>
			<Typography variant="body1" gutterBottom>
				Book your appointment today and start your journey to reLaxation
				and reJuvenation.
			</Typography>
			<Button
				variant="contained"
				color="primary"
				href="/appointment" // Change to the actual booking page when it's ready
			>
				Book Appointment
			</Button>
		</Box>
	);
};

export default ReadyToRelax;
