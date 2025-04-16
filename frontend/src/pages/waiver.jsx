import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WaiverForm = () => {
  // State to collect user info for the waiver
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to handle the waiver signing process
  const handleSignWaiver = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare the data to send to the backend
    const waiverData = {
      firstName,
      lastName,
      date,
    };

    try {
      // Call your backend endpoint to trigger DocuSign envelope creation.
      // The backend should return a signing URL for the DocuSign process.
      const res = await axios.post("http://localhost:5000/api/waivers/start", waiverData);
      const signingUrl = res.data.signingUrl;
      
      // Redirect user to DocuSign to sign the waiver
      window.location.href = signingUrl;
    } catch (error) {
      toast.error("Failed to initiate signing process. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          p: 4,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
          mt: 4,
          textAlign: "center"
        }}
      >
        <Typography variant="h4" gutterBottom>
          Sign Waiver
        </Typography>
        <form onSubmit={handleSignWaiver}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" type="submit" disabled={loading} fullWidth>
            {loading ? "Processing..." : "Sign Waiver"}
          </Button>
        </form>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default WaiverForm;
