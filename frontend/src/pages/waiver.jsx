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
      url: "https://waivermaster.com/sign.html?q=DWUAT4XBNAYD9"
    },
    {
      name: "Skincare Waiver",
      url: "https://waivermaster.com/sign.html?q=DJBC7DLM8GFKM"
    },
    {
      name: "Brow & Lash Waiver",
      url: "https://waivermaster.com/sign.html?q=D3DU5CRMUP2D2"
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
