import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Avatar, Card, IconButton, TextField, Button, List, ListItem, 
  ListItemAvatar, ListItemText, Divider
} from '@mui/material';
import { Email, Phone, Edit } from '@mui/icons-material';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState({ name: '', email: '', phone: '' });

  // Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setEditedProfile({ name: res.data.name, email: res.data.email, phone: res.data.phone });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!profile) return <Typography>Loading profile...</Typography>;

  // Handle Edit & Save
  const handleEditToggle = () => setIsEditing(!isEditing);
  const handleInputChange = (e) => setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/update', editedProfile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: 'primary.light', py: 5, minHeight: '100vh' }}>
      <Container maxWidth="sm">
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3, bgcolor: 'white', textAlign: 'center' }}>
          
          {/* Profile Picture */}
          <Avatar 
            alt="Profile Picture"
            src={profile.profilePicture || 'https://via.placeholder.com/120'}
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
          />

          {/* Edit Button */}
          <IconButton onClick={handleEditToggle} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Edit />
          </IconButton>

          {/* Editable Profile Info */}
          {isEditing ? (
            <>
              <TextField
                label="Name"
                name="name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={editedProfile.name}
                onChange={handleInputChange}
              />
              <TextField
                label="Email"
                name="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={editedProfile.email}
                onChange={handleInputChange}
              />
              <TextField
                label="Phone"
                name="phone"
                variant="outlined"
                fullWidth
                margin="normal"
                value={editedProfile.phone}
                onChange={handleInputChange}
              />
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>{profile.name}</Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Email sx={{ mr: 1 }} /> {profile.email}
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <Phone sx={{ mr: 1 }} /> {profile.phone}
              </Typography>
            </>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Appointment History (Dummy Data) */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Recent Appointments</Typography>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar src="https://via.placeholder.com/40" />
              </ListItemAvatar>
              <ListItemText
                primary="Relaxing Spa Session"
                secondary="Jan 15, 2025 • 2 Guests • Completed"
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar src="https://via.placeholder.com/40" />
              </ListItemAvatar>
              <ListItemText
                primary="Massage Therapy"
                secondary="Jan 10, 2025 • 1 Guest • Completed"
              />
            </ListItem>
          </List>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfilePage;
