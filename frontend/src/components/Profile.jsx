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
  Divider
} from "@mui/material";
import { Email, Phone, Edit } from "@mui/icons-material";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ name: "", phone: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios
      .get("/api/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setProfile(res.data);
        setEditedProfile({ name: res.data.name, phone: res.data.phone });
      })
      .catch(console.error);
  }, [navigate]);

  if (!profile) return <Typography>Loading profile…</Typography>;

  const saveProfile = async () => {
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
  };

  return (
    <Box sx={{ bgcolor: "primary.light", py: 5, minHeight: "100vh" }}>
      <Container maxWidth="sm">
        <Card
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: "white",
            textAlign: "center",
            position: "relative"
          }}
        >
          <IconButton
            aria-label="Edit Profile"
            onClick={() => setIsEditing(edit => !edit)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <Edit />
          </IconButton>

          {isEditing ? (
            <>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={editedProfile.name}
                onChange={e =>
                  setEditedProfile(p => ({ ...p, name: e.target.value }))
                }
              />
              <TextField
                label="Phone"
                fullWidth
                margin="normal"
                value={editedProfile.phone}
                onChange={e =>
                  setEditedProfile(p => ({ ...p, phone: e.target.value }))
                }
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={saveProfile} sx={{ mr: 1 }}>
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                {profile.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Email sx={{ mr: 1 }} /> {profile.email}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 1
                }}
              >
                <Phone sx={{ mr: 1 }} /> {profile.phone || "(no phone on file)"}
              </Typography>
            </>
          )}

          <Divider sx={{ my: 3 }} />

          {/* You can drop in any other profile-related content here */}
        </Card>
      </Container>
    </Box>
  );
}
