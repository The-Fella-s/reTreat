// src/pages/EmployeeSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid2 } from '@mui/material';
import axios from 'axios';
import EmployeeInputForm from '../../components/EmployeeInputForm';
import EmployeeCardAdminEdit from '../../components/EmployeeCardAdminEdit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EmployeeSection() {
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    description: '',
    profilePictureFile: null,
    profilePicturePreview: '',
    profilePicture: ''
  });
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/employees');
        setList(data);
      } catch (e) {
        toast.error('Failed to load');
      }
    })();
  }, []);

  const changeField = useCallback((name, val) => {
    setEmployee(prev => ({ ...prev, [name]: val }));
  }, []);

  const onSave = async () => {
    try {
      let url = employee.profilePicture;
      if (employee.profilePictureFile) {
        const f = new FormData();
        f.append('profilePicture', employee.profilePictureFile);
        const r = await axios.post('/api/employees/upload', f, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        url = r.data.filePath;
      }

      const payload = { ...employee, profilePicture: url };
      if (editingId) {
        await axios.put(`/api/employees/${editingId}`, payload);
        toast.success('Updated');
      } else {
        await axios.post('/api/employees', payload);
        toast.success('Added');
      }

      // reset + refresh
      setEmployee({
        firstName:'',lastName:'',email:'',phone:'',
        profession:'',description:'',
        profilePictureFile:null,profilePicturePreview:'',profilePicture:''
      });
      setEditingId(null);
      const { data } = await axios.get('/api/employees');
      setList(data);
    } catch (e) {
      toast.error('Save failed');
    }
  };

  return (
    <Box sx={{ p:3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Management
      </Typography>
      <Grid2 container spacing={2} sx={{ flexDirection:{ xs:'column', sm:'row' } }}>
        <Grid2 xs={12} sm={6}>
          <EmployeeInputForm
            employee={employee}
            onChange={changeField}
            onSubmit={onSave}
            isEditing={Boolean(editingId)}
          />
        </Grid2>
        <Grid2 xs={12} sm={6}>
          <EmployeeCardAdminEdit employee={employee} isPreview />
        </Grid2>
      </Grid2>

      <Typography variant="h4" sx={{ mt:4, mb:2 }}>
        Existing Employees
      </Typography>
      <Grid2 container spacing={2}>
        {list.map(emp => (
          <Grid2 key={emp._id} xs={12} sm={6} md={4}>
            <EmployeeCardAdminEdit
              employee={emp}
              onEdit={() => {
                setEmployee({ ...emp, profilePictureFile: null, profilePicturePreview: '' });
                setEditingId(emp._id);
              }}
              onDelete={async id => {
                await axios.delete(`/api/employees/${id}`);
                setList(l => l.filter(x => x._id !== id));
                toast.info('Deleted');
              }}
            />
          </Grid2>
        ))}
      </Grid2>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}
