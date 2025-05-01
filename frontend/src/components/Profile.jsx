import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  IconButton,
  TextField,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { Email, Phone, Edit } from "@mui/icons-material";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [waivers, setWaivers] = useState([]);
  const [selectedWaiver, setSelectedWaiver] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ name: "", phone: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    const headers = { Authorization: `Bearer ${token}` };

    axios.get("/api/users/me", { headers })
      .then(res => {
        setProfile(res.data);
        setEditedProfile({ name: res.data.name, phone: res.data.phone });
      })
      .catch(console.error);

    axios.get("/api/waivers/my", { headers })
      .then(res => setWaivers(res.data))
      .catch(console.error);
  }, [navigate]);

  if (!profile) return <Typography>Loading profile…</Typography>;

  return (
    <Box sx={{ bgcolor: "primary.light", py: 5, minHeight: "100vh" }}>
      <Container maxWidth="sm">
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3, bgcolor: "white", textAlign: "center", position: "relative" }}>
          <IconButton
            aria-label="Edit Profile"
            onClick={() => setIsEditing(x => !x)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <Edit />
          </IconButton>

          {isEditing ? (
            <>
              <TextField
                label="Name"
                name="name"
                fullWidth
                margin="normal"
                value={editedProfile.name}
                onChange={e => setEditedProfile(p => ({ ...p, name: e.target.value }))}
              />
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                margin="normal"
                value={editedProfile.phone}
                onChange={e => setEditedProfile(p => ({ ...p, phone: e.target.value }))}
              />
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    try {
                      const res = await axios.put(
                        `/api/users/update-profile/${user.id}`,
                        { name: editedProfile.name, phone: editedProfile.phone },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      setProfile(res.data.user);
                      setIsEditing(false);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  sx={{ mr: 1 }}
                >
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setIsEditing(false)}>Cancel</Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>{profile.name}</Typography>
              <Typography variant="body1" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Email sx={{ mr: 1 }} /> {profile.email}
              </Typography>
              <Typography variant="body1" sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 1 }}>
                <Phone sx={{ mr: 1 }} /> {profile.phone || "(no phone on file)"}
              </Typography>
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" align="left" gutterBottom>My Waivers</Typography>
          {waivers.length === 0 ? (
            <Typography>You haven’t submitted any waivers yet.</Typography>
          ) : (
            <List>
              {waivers.map(w => (
                <ListItem key={w._id} sx={{ mb: 1, border: "1px solid #eee", borderRadius: 1 }}>
                  <ListItemText
                    primary={`${w.waiverType.charAt(0).toUpperCase() + w.waiverType.slice(1)} — ${new Date(w.dateSigned).toLocaleDateString()}`}
                    secondary={`Status: ${w.status}`}
                  />
                  <Button onClick={() => setSelectedWaiver(w)} sx={{ mr: 1 }}>View Details</Button>
                </ListItem>
              ))}
            </List>
          )}

          <Dialog open={!!selectedWaiver} onClose={() => setSelectedWaiver(null)} fullWidth maxWidth="sm">
            <DialogTitle>Waiver Details</DialogTitle>
            <DialogContent dividers>
              {selectedWaiver && Object.entries(selectedWaiver.formData).map(([key, val]) => (
                <Box key={key} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>
                    {key.replace(/([A-Z])/g, " $1")}
                  </Typography>
                  <Typography variant="body2">
                    {Array.isArray(val) ? val.join(", ") : val}
                  </Typography>
                </Box>
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedWaiver(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Container>
    </Box>
  );
}