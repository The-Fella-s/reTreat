import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { toast } from 'react-toastify';

const WaiverSection = () => {
  const [waivers, setWaivers] = useState([]);

  useEffect(() => {
    fetchWaivers();
  }, []);

  const fetchWaivers = async () => {
    try {
      const res = await axios.get("/api/waivers");
      console.log("Waivers response:", res.data);
      const waiversData = Array.isArray(res.data) ? res.data : res.data.waivers;
      setWaivers(waiversData || []);
    } catch (error) {
      toast.error("Failed to load waivers.");
    }
  };
  


  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/waivers/${id}/approve`);
      toast.success("Waiver approved!");
      fetchWaivers(); // refresh list
    } catch (error) {
      toast.error("Error approving waiver.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`/api/waivers/${id}/reject`);
      toast.success("Waiver rejected!");
      fetchWaivers(); // refresh list
    } catch (error) {
      toast.error("Error rejecting waiver.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Waiver Requests</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User Name</TableCell>
            <TableCell>Date Signed</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {waivers.map((w) => (
            <TableRow key={w._id}>
              <TableCell>{w.userName}</TableCell>
              <TableCell>{new Date(w.dateSigned).toLocaleDateString()}</TableCell>
              <TableCell>{w.status}</TableCell>
              <TableCell>
                {w.status === 'pending' && (
                  <>
                    <Button variant="contained" color="success" onClick={() => handleApprove(w._id)}>
                      Approve
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleReject(w._id)} sx={{ ml: 2 }}>
                      Reject
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default WaiverSection;
