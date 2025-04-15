import React from "react";
import { Box, Container, Typography, Button } from "@mui/material"; // Might change things utilizing Grid2 later on, leaving here for now

function MainPage() {
	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			{/* Header Section */}
			<Box sx={{ textAlign: "center", mb: 4}}>
				<Typography variant = "h4" color = 'secondary'> Voted Best of the Best 3 Years in a Row! </Typography>
				<Typography variant="h2" sx={{ mb: 2 }}>
					Welcome to reTreat Salon & Spa!
					<Box
						sx={{
							position: "relative",
							overflow: "hidden",
							width: "100%",
							paddingTop: "56.25%", // 16:9 Aspect Ratio
							mt: 2,
							mb: 2,
						}}
					>
						<iframe
							width="100%"
							height="100%"
							src="https://www.youtube.com/embed/Q0F3Cp4OGW4?si=cTUz9fAer0dOwO1-"
							title="About reTreat Salon & Spa"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							style={{
								position: "absolute",
								top: 0,
								left: 390,
								width: "31.5%",
								height: "99.5%",
								borderRadius: 20,
								border: 100,
								borderColor: "text.secondary",
							}}
						/>
					</Box>
				</Typography>
				<Button
					variant="contained"
					color="primary"
					href="/about-us"
				>
					Learn More About Us!
				</Button>
			</Box>
		</Container>
	);
}

export default MainPage;
