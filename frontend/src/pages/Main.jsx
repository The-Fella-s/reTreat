import React from "react";
import ReactPlayer from "react-player";
import { Box, Container, Typography, Button } from "@mui/material";
import SocialMedia from "../components/SocialMedia";
import Reviews from "../components/Reviews";
import ReadyToRelax from "../components/ReadyToRelax";

function Main() {
  return (
    <Box>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header Section */}

        <Box sx={{ textAlign: "center", mb: 4 }}>

          <Typography variant="h4" color="secondary">
            Voted Best of the Best 3 Years in a Row!
          </Typography>

          <Typography variant="h2" sx={{ mb: 2 }}>
            Welcome to reTreat Salon & Spa!
          </Typography>

          {/* Video Container */}
          <Box
            sx={{
              position: "relative",
              width: "31.5%",
              paddingTop: "56.25%", // 16∶9 Aspect Ratio
              mt: 2,
              mb: 2,
              mx: "auto",
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "text.secondary",
            }}
          >
            <ReactPlayer
              url="https://www.youtube.com/watch?v=Q0F3Cp4OGW4?si=cTUz9fAer0dOwO1-"
              width="100%"
              height="100%"
              style={{ position: "absolute", top: 0, left: 0 }}
              controls
            />
          </Box>

          <Button variant="contained" color="primary" href="/about-us">
            Learn More About Us!
          </Button>
        </Box>
      </Container>

      <SocialMedia />
      <Reviews />
      <ReadyToRelax />

    </Box>
  );
}

export default Main;
