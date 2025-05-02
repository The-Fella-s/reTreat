import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";

export default function WaiverForms() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const iframeRef = useRef(null);

  const [templates, setTemplates] = useState([]);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const [values, setValues] = useState({ firstName: "", lastName: "", email: "" });
  const [dsUrl, setDsUrl] = useState("");
  const [dsOpen, setDsOpen] = useState(false);
  const [dsLoading, setDsLoading] = useState(false);

  // Fetch templates on mount
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const { data } = await axios.get("/api/docusign/templates", { headers });
        setTemplates(data.templates);
      } catch {
        toast.error("Could not load templates.");
      }
    })();
  }, []);

  const selectedTemplate = templates.find(t => t.templateId === selectedTemplateId);

  const openTemplateDialog = () => setTemplateDialogOpen(true);

  const handleTemplateSelect = (id) => {
    setSelectedTemplateId(id);
    setTemplateDialogOpen(false);
  };

  const handleChange = (name) => (e) =>
    setValues(prev => ({ ...prev, [name]: e.target.value }));

  const handleSubmit = async () => {
    const { firstName, lastName, email } = values;
    if (!firstName.trim() || !lastName.trim() || !(email.trim() || user?.email)) {
      return toast.error("First Name, Last Name, and Email are required.");
    }
    if (!selectedTemplateId) {
      return toast.error("Please choose a template first.");
    }
    try {
      setDsLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Create waiver record to get ID
      const { data: waiver } = await axios.post(
        "/api/waivers",
        { waiverType: selectedTemplate?.name, formData: values },
        { headers }
      );

      const { data } = await axios.post(
        "/api/docusign/send-envelope",
        {
          customerEmail: values.email || user?.email,
          customerName: `${values.firstName} ${values.lastName}`,
          clientUserId: waiver._id,
          templateId: selectedTemplateId
        },
        { headers }
      );

      setDsUrl(data.signingUrl);
      setDsOpen(true);
    } catch {
      toast.error("Error launching DocuSign—please try again.");
    } finally {
      setDsLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Select Template
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button variant="outlined" onClick={openTemplateDialog}>
          {selectedTemplate ? selectedTemplate.name : 'Choose Template'}
        </Button>
      </Box>

      {selectedTemplate && (
        <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            {selectedTemplate.name}
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="First Name"
              value={values.firstName}
              onChange={handleChange('firstName')}
              required
              fullWidth
            />
            <TextField
              label="Last Name"
              value={values.lastName}
              onChange={handleChange('lastName')}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              required
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={dsLoading}
              fullWidth
            >
              {dsLoading ? <CircularProgress size={24} /> : 'Sign'}
            </Button>
          </Box>
        </Paper>
      )}

      <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Select a DocuSign Template</DialogTitle>
        <DialogContent dividers>
          <List>
            {templates.map(t => (
              <ListItem button key={t.templateId} onClick={() => handleTemplateSelect(t.templateId)}>
                <ListItemText primary={t.name} secondary={t.description} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dsOpen} onClose={() => setDsOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Sign with DocuSign</DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: '80vh' }}>
          {dsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <iframe
              ref={iframeRef}
              title="DocuSign Signer"
              src={dsUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              onLoad={() => {
                try {
                  const href = iframeRef.current.contentWindow.location.href;
                  if (href.includes('/waiver-complete')) {
                    setDsOpen(false);
                    toast.success('Signed successfully!');
                    navigate('/');
                  }
                } catch {}
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-right" autoClose={5000} />
    </Container>
  );
}