import React from "react";
import { Box, Container, Typography, Button } from "@mui/material"; // Might change things utilizing Grid2 later on, leaving here for now
import img from "/src/assets/StockImage.jpg";

function MainPage() {
	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			{/* Header Section */}
			<Box sx={{ textAlign: "center", mb: 4, color: "primary.main" }}>
				<Typography variant="h3" color="text.secondary" sx={{ mb: 2 }}>
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
							src="https://www.youtube.com/embed/jNQXAC9IVRw"
							title="About reTreat Salon & Spa"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: "100%",
								borderRadius: 6,
								border: 6,
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
