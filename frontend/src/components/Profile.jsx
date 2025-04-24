import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Card,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material';
import { Email, Phone, Edit } from '@mui/icons-material';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [editedProfile, setEditedProfile] = useState({
    name: '',
    phone: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setEditedProfile({
          name: res.data.name,
          phone: res.data.phone
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  if (!profile) return <Typography>Loading profile...</Typography>;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditedProfile({
        name: profile.name,
        phone: profile.phone
      });
      setSelectedFile(null);
    }
  };

  const handleInputChange = (e) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', editedProfile.name);
      formData.append('phone', editedProfile.phone);
      if (selectedFile) {
        formData.append('profilePicture', selectedFile);
      }
      const res = await axios.put(
        `/api/users/update-profile/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setProfile(res.data.user);
      setIsEditing(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const profileImageUrl = profile.profilePicture
    ? `${profile.profilePicture}`
    : 'https://via.placeholder.com/120';

  return (
    <Box sx={{ bgcolor: 'primary.light', py: 5, minHeight: '100vh' }}>
      <Container maxWidth="sm">
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3, bgcolor: 'white', textAlign: 'center', position: 'relative' }}>
          <Avatar
            alt="Profile Picture"
            src={isEditing && preview ? preview : profileImageUrl}
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
          />
          <IconButton onClick={handleEditToggle} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Edit />
          </IconButton>
          {isEditing ? (
            <>
              <Button variant="contained" component="label" sx={{ mb: 2 }}>
                Choose File
                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
              </Button>
              {selectedFile && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {selectedFile.name}
                </Typography>
              )}
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
                label="Phone"
                name="phone"
                variant="outlined"
                fullWidth
                margin="normal"
                value={editedProfile.phone}
                onChange={handleInputChange}
              />
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2, mr: 2 }}>
                Save Changes
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleEditToggle} sx={{ mt: 2 }}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                {profile.name}
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Email sx={{ mr: 1 }} /> {profile.email}
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <Phone sx={{ mr: 1 }} /> {profile.phone}
              </Typography>
            </>
          )}
          <Divider sx={{ my: 3 }} />
        </Card>
      </Container>
    </Box>
  );
};

export default ProfilePage;
