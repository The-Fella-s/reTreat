import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

const EmployeeSection = () => {
  const [employees, setEmployees] = useState([]); // Employee state
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    schedule: '',
    email: ''
  });

  // Fetch data from backend when the component loads
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employees');
        setEmployees(response.data); // Update the state with data from the backend
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []); // Empty dependency array means this will run only once when the component mounts

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setEditedEmployee({ ...employee });
  };

  const handleSave = () => {
    setEmployees(employees.map((e) => (e === editingEmployee ? editedEmployee : e)));
    setEditingEmployee(null);
  };

  const handleCancel = () => setEditingEmployee(null);

  const handleChange = (e) => {
    setEditedEmployee({ ...editedEmployee, [e.target.name]: e.target.value });
  };

  const handleOpenDialog = () => {
    setNewEmployee({ firstName: '', lastName: '', address: '', phone: '', schedule: '', email: '' });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleNewEmployeeChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      setEmployees(employees.filter((employee) => employee._id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleAddEmployee = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/employees', newEmployee);
      setEmployees((prevEmployees) => [...prevEmployees, response.data]);
      setIsDialogOpen(false);
      setErrorMessage('');
      setNewEmployee({ firstName: '', lastName: '', address: '', phone: '', schedule: '', email: '' });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An unknown error occurred. Please try again.');
      }
      console.error('Error adding employee:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Information
      </Typography>

      <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{ mb: 2 }}>
        Add Employee
      </Button>

      {errorMessage && (
        <Typography color="error" variant="body2" style={{ marginTop: '10px' }}>
          {errorMessage}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>{employee.firstName}</TableCell>
                <TableCell>{employee.lastName}</TableCell>
                <TableCell>{employee.address}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.schedule}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(employee)} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(employee._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editingEmployee && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5">Edit Employee</Typography>
          <TextField name="firstName" label="First Name" value={editedEmployee.firstName} onChange={handleChange} sx={{ mr: 2 }} />
          <TextField name="lastName" label="Last Name" value={editedEmployee.lastName} onChange={handleChange} sx={{ mr: 2 }} />
          <TextField name="address" label="Address" value={editedEmployee.address} onChange={handleChange} sx={{ mr: 2 }} />
          <TextField name="phone" label="Phone" value={editedEmployee.phone} onChange={handleChange} sx={{ mr: 2 }} />
          <TextField name="schedule" label="Schedule" value={editedEmployee.schedule} onChange={handleChange} sx={{ mr: 2 }} />
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleSave}>Save</Button>
            <Button variant="outlined" onClick={handleCancel} sx={{ ml: 2 }}>Cancel</Button>
          </Box>
        </Box>
      )}

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" name="firstName" label="First Name" value={newEmployee.firstName} onChange={handleNewEmployeeChange} />
          <TextField fullWidth margin="dense" name="lastName" label="Last Name" value={newEmployee.lastName} onChange={handleNewEmployeeChange} />
          <TextField fullWidth margin="dense" name="address" label="Address" value={newEmployee.address} onChange={handleNewEmployeeChange} />
          <TextField fullWidth margin="dense" name="phone" label="Phone" value={newEmployee.phone} onChange={handleNewEmployeeChange} />
          <TextField fullWidth margin="dense" name="schedule" label="Schedule" value={newEmployee.schedule} onChange={handleNewEmployeeChange} />
          <TextField fullWidth margin="dense" name="email" label="Email" value={newEmployee.email} onChange={handleNewEmployeeChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleAddEmployee} color="primary" variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeSection;
