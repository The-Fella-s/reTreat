// src/components/WaiverSection.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Box, CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';

export default function WaiverSection() {
  const [waivers, setWaivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [selectedWaiver, setSelectedWaiver] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchWaivers();
  }, []);

  const fetchWaivers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/waivers', { headers: getAuthHeaders() });
      setWaivers(Array.isArray(res.data) ? res.data : res.data.waivers);
    } catch (err) {
      console.error('Fetch waivers error:', err);
      toast.error('Failed to load waivers.');
    } finally {
      setLoading(false);
    }
  };

  // … inside your WaiverSection component …

// Optimistic approve with real logging + refresh
// Optimistic approve with full logs
const handleApprove = async (id) => {
  console.log('→ Approve clicked for', id);
  setActionLoadingId(id);

  try {
    const res = await axios.put(
      `/api/waivers/${id}/approve`,
      {},
      { headers: getAuthHeaders() }
    );
    console.log('✅ Approve response:', res);
    toast.success('Waiver approved!');
    await fetchWaivers();    // re‐fetch full list
  } catch (err) {
    console.error('❌ Approve error:', err.response?.data || err);
    toast.error(`Error approving waiver: ${err.response?.data?.message || err.message}`);
  } finally {
    setActionLoadingId(null);
  }
};

// Optimistic reject with full logs
const handleReject = async (id) => {
  console.log('→ Reject clicked for', id);
  setActionLoadingId(id);

  try {
    const res = await axios.put(
      `/api/waivers/${id}/reject`,
      {},
      { headers: getAuthHeaders() }
    );
    console.log('✅ Reject response:', res);
    toast.success('Waiver rejected!');
    await fetchWaivers();    // re‐fetch full list
  } catch (err) {
    console.error('❌ Reject error:', err.response?.data || err);
    toast.error(`Error rejecting waiver: ${err.response?.data?.message || err.message}`);
  } finally {
    setActionLoadingId(null);
  }
};

  const handleView  = (w) => setSelectedWaiver(w);
  const handleClose = ()  => setSelectedWaiver(null);

  if (loading) return <Typography>Loading waivers…</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt:4 }}>
      <Typography variant="h4" gutterBottom>Waiver Requests</Typography>

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
          {waivers.map(w => (
            <TableRow key={w._id}>
              <TableCell>{w.waiverType}</TableCell>
              <TableCell>{`${w.formData.firstName || ''} ${w.formData.lastName || ''}`}</TableCell>
              <TableCell>{new Date(w.dateSigned).toLocaleDateString()}</TableCell>
              <TableCell>{w.status}</TableCell>
              <TableCell>
                <Button variant="text" onClick={() => handleView(w)}>VIEW</Button>
                {w.envelopeId && (
                  <Button
                    variant="outlined"
                    component="a"
                    href={`/api/docusign/envelopes/${w._id}/document`}
                    target="_blank"
                    sx={{ ml:1 }}
                  >
                    VIEW SIGNED PDF
                  </Button>
                )}
                {w.status === 'pending' && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleApprove(w._id)}
                      disabled={actionLoadingId === w._id}
                      startIcon={actionLoadingId === w._id ? <CircularProgress size={16}/> : null}
                      sx={{ ml:1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleReject(w._id)}
                      disabled={actionLoadingId === w._id}
                      startIcon={actionLoadingId === w._id ? <CircularProgress size={16}/> : null}
                      sx={{ ml:1 }}
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

      <Dialog open={Boolean(selectedWaiver)} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Waiver Details</DialogTitle>
        <DialogContent dividers>
          {selectedWaiver && Object.entries(selectedWaiver.formData).map(([k, v]) => (
            <Box key={k} sx={{ mb:2 }}>
              <Typography variant="subtitle2" sx={{ textTransform:'capitalize' }}>
                {k.replace(/([A-Z])/g,' $1')}
              </Typography>
              <Typography variant="body2">{Array.isArray(v) ? v.join(', ') : v}</Typography>
            </Box>
          ))}
          {selectedWaiver?.envelopeId && (
            <Box sx={{ mt:4 }}>
              <Typography variant="h6" gutterBottom>Signed Document</Typography>
              <object
                data={`/api/docusign/envelopes/${selectedWaiver._id}/document`}
                type="application/pdf"
                width="100%"
                height="400px"
                style={{ border:'1px solid #ccc' }}
              >
                <p>Your browser doesn’t support PDFs. <a href={`/api/docusign/envelopes/${selectedWaiver._id}/document`} target="_blank" rel="noopener noreferrer">Download here</a>.</p>
              </object>
            </Box>
          )}
        </DialogContent>
        <DialogActions><Button onClick={handleClose}>Close</Button></DialogActions>
      </Dialog>
    </Container>
  );
}
