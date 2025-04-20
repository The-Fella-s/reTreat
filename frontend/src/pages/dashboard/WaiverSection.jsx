import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box
} from '@mui/material';
import { toast } from 'react-toastify';

const WaiverSection = () => {
  const [waivers, setWaivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWaiver, setSelectedWaiver] = useState(null);

  useEffect(() => {
    fetchWaivers();
  }, []);

  const fetchWaivers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/waivers');
      const data = Array.isArray(res.data) ? res.data : res.data.waivers;
      setWaivers(data || []);
    } catch (error) {
      toast.error('Failed to load waivers.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/waivers/${id}/approve`);
      toast.success('Waiver approved!');
      fetchWaivers();
    } catch (error) {
      toast.error('Error approving waiver.');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`/api/waivers/${id}/reject`);
      toast.success('Waiver rejected!');
      fetchWaivers();
    } catch (error) {
      toast.error('Error rejecting waiver.');
    }
  };

  const handleView = (waiver) => {
    setSelectedWaiver(waiver);
  };

  const handleClose = () => {
    setSelectedWaiver(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Waiver Requests
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Date Signed</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {waivers.map((w) => (
            <TableRow key={w._id}>
              <TableCell>{w.waiverType}</TableCell>
              <TableCell>
                {(w.formData.firstName || '') + ' ' + (w.formData.lastName || '')}
              </TableCell>
              <TableCell>{new Date(w.dateSigned).toLocaleDateString()}</TableCell>
              <TableCell>{w.status}</TableCell>
              <TableCell>
                <Button variant="text" onClick={() => handleView(w)}>
                  View
                </Button>
                {w.status === 'pending' && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleApprove(w._id)}
                      sx={{ ml: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleReject(w._id)}
                      sx={{ ml: 1 }}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={Boolean(selectedWaiver)}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Waiver Details</DialogTitle>
        <DialogContent dividers>
          {selectedWaiver &&
            Object.entries(selectedWaiver.formData).map(([key, value]) => (
              <Box key={key} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                  {key.replace(/([A-Z])/g, ' $1')}
                </Typography>
                <Typography variant="body2">{value}</Typography>
              </Box>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WaiverSection;
