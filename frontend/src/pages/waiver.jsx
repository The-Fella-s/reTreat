import React from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button
} from "@mui/material";

export default function WaiverForms() {
  const waiverLinks = [
    {
      name: "Massage Waiver",
      url:
        "https://waivermaster.com/r/2025-04-20/c0e747ce-cb4c-4ec2-981f-2ad83f5b42e3/7756b408-b221-4ad2-9f29-de323479414b/8df27dc6-a39f-44d0-8be1-70db58a9f54f.html"
    },
    {
      name: "Wax Waiver",
      url: "https://waivermaster.com/r/2025-05-04/c0e747ce-cb4c-4ec2-981f-2ad83f5b42e3/9c557ebd-9cb1-44e4-a47f-7c421ff724a7/d1bcb9f0-1def-4523-867b-9930c9298e36.html"
    },
    {
      name: "Skincare Waiver",
      url: "https://waivermaster.com/r/2025-05-04/c0e747ce-cb4c-4ec2-981f-2ad83f5b42e3/4af67c3c-53e8-4917-9b45-61c8be1b976a/f10b7e69-a99d-4dc6-98bc-2108317b85a7.html"
    },
    {
      name: "Brow & Lash Waiver",
      url: "https://waivermaster.com/r/2025-05-04/c0e747ce-cb4c-4ec2-981f-2ad83f5b42e3/3a7dd5bc-9498-49ea-8da1-50b38004738e/63401fec-726b-4b20-9c15-92a89fb1c7ab.html"
    }
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Service Waivers
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {waiverLinks.map((link) => (
          <Grid item xs={12} sm={6} md={3} key={link.url}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="subtitle1" gutterBottom>
                {link.name}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => window.open(link.url, "_blank")}
              >
                Open Waiver
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
