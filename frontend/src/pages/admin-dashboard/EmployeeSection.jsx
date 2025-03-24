import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
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
    schedule: { days: [], startTime: '', endTime: '', customShifts: [] },
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
    // Ensure the schedule has a valid structure when editing
    setEditingEmployee(employee);
    setEditedEmployee({
      ...employee,
      schedule: {
        ...employee.schedule,
        days: employee.schedule.days || [], // Ensure days is always an array
        startTime: employee.schedule.startTime || '',
        endTime: employee.schedule.endTime || '',
        customShifts: employee.schedule.customShifts || [] 
      },
    });
  };

  const handleSave = async () => {
    try {
      // Send the updated employee data to the backend
      await axios.put(`http://localhost:5000/api/employees/${editingEmployee._id}`, editedEmployee);

      // Update the local state after a successful update
      setEmployees(employees.map((e) => (e._id === editingEmployee._id ? editedEmployee : e)));
      setEditingEmployee(null); // Close the editing form
    } catch (error) {
      console.error('Error updating employee:', error);
      // Set an error message to notify the user
      setErrorMessage('Failed to update employee. Please try again.');
    }
  };

  const handleCancel = () => setEditingEmployee(null);

  const handleScheduleDayChange = (day) => {
    const days = [...editedEmployee.schedule.days];
    
    // Check if the day is already selected
    if (days.includes(day)) {
      // Remove the day from the schedule
      const index = days.indexOf(day);
      days.splice(index, 1);
    } else {
      // Add the day to the schedule
      days.push(day);
    }
    
    // Update the schedule with the new days array
    setEditedEmployee({
      ...editedEmployee,
      schedule: { ...editedEmployee.schedule, days },
    });
  };

  const handleScheduleTimeChange = (e, field) => {
    const value = e.target.value;
    setEditedEmployee({
      ...editedEmployee,
      schedule: {
        ...editedEmployee.schedule,
        [field]: value,
      },
    });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'schedule') {
      const schedule = JSON.parse(value); // Ensure schedule is an object when editing
      setEditedEmployee({ ...editedEmployee, schedule });
    } else {
      setEditedEmployee({ ...editedEmployee, [name]: value });
    }
  };
  
  const handleOpenDialog = () => {
    setNewEmployee({
      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      schedule: { days: [], startTime: '', endTime: '', customShifts: [] },
      email: ''
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    if (name === 'schedule') {
      const schedule = JSON.parse(value);  // Assuming input is in JSON format
      setNewEmployee({ ...newEmployee, schedule });
    } else {
      setNewEmployee({ ...newEmployee, [name]: value });
    }
  };
  
  const handleDaysChange = (e) => {
    const { value } = e.target;
    setNewEmployee({ ...newEmployee, schedule: { ...newEmployee.schedule, days: value } });
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, schedule: { ...newEmployee.schedule, [name]: value } });
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
      setNewEmployee({
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        schedule: { days: [], startTime: '', endTime: '', customShifts: [] },
        email: ''
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An unknown error occurred. Please try again.');
      }
      console.error('Error adding employee:', error);
    }
  };

  const renderSchedulePreview = (schedule) => {
    const days = schedule.days.join(', ');
    let preview = `${days}: ${schedule.startTime} - ${schedule.endTime}`;
    if (schedule.customShifts && schedule.customShifts.length > 0) {
      preview += ' | Custom: ' + schedule.customShifts.map(shift => `${shift.day}: ${shift.startTime} - ${shift.endTime}`).join(', ');
    }
    return preview;
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
                <TableCell>{renderSchedulePreview(employee.schedule)}</TableCell>
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
          <TextField
            name="firstName" label="First Name" value={editedEmployee.firstName} onChange={handleChange} sx={{ mr: 2 }}
          />
          <TextField
            name="lastName" label="Last Name" value={editedEmployee.lastName} onChange={handleChange} sx={{ mr: 2 }}
          />
          <TextField
            name="address" label="Address" value={editedEmployee.address} onChange={handleChange} sx={{ mr: 2 }}
          />
          <TextField
            name="phone" label="Phone" value={editedEmployee.phone} onChange={handleChange} sx={{ mr: 2 }}
          />
          <TextField
            name="email" label="Email" value={editedEmployee.email} onChange={handleChange} sx={{ mr: 2 }}
          />

          {/* Schedule Input with checkboxes and time pickers */}
          <Typography variant="body1" sx={{ mt: 2 }}>Schedule</Typography>

          {/* Days checkboxes */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <Box key={day} sx={{ mr: 2, mb: 2 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={editedEmployee.schedule.days.includes(day)}
                    onChange={() => handleScheduleDayChange(day)}
                  />
                  {day}
                </label>
              </Box>
            ))}
          </Box>

          {/* Time pickers for Start and End Time */}
          <TextField
            name="scheduleStartTime" label="Start Time" type="time" value={editedEmployee.schedule.startTime} onChange={(e) => handleScheduleTimeChange(e, 'startTime')} sx={{ mr: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            name="scheduleEndTime" label="End Time" type="time" value={editedEmployee.schedule.endTime} onChange={(e) => handleScheduleTimeChange(e, 'endTime')}
            sx={{ mr: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          {/* Custom Shift Section */}
          <Typography variant="body1" sx={{ mt: 2 }}>Custom Shifts</Typography>
          {editedEmployee.schedule.customShifts && editedEmployee.schedule.customShifts.map((shift, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FormControl sx={{ mr: 2, minWidth: 120 }}>
                <InputLabel>Day</InputLabel>
                <Select
                  value={shift.day || ''}
                  label="Day"
                  onChange={(e) => {
                    const updatedShifts = [...editedEmployee.schedule.customShifts];
                    updatedShifts[index].day = e.target.value;
                    setEditedEmployee({
                      ...editedEmployee,
                      schedule: { ...editedEmployee.schedule, customShifts: updatedShifts }
                    });
                  }}
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <MenuItem key={day} value={day}>{day}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                type="time"
                value={shift.startTime}
                onChange={(e) => {
                  const updatedShifts = [...editedEmployee.schedule.customShifts];
                  updatedShifts[index].startTime = e.target.value;
                  setEditedEmployee({
                    ...editedEmployee,
                    schedule: { ...editedEmployee.schedule, customShifts: updatedShifts }
                  });
                }}
                sx={{ mr: 2 }}
              />
              <TextField
                type="time"
                value={shift.endTime}
                onChange={(e) => {
                  const updatedShifts = [...editedEmployee.schedule.customShifts];
                  updatedShifts[index].endTime = e.target.value;
                  setEditedEmployee({
                    ...editedEmployee,
                    schedule: { ...editedEmployee.schedule, customShifts: updatedShifts }
                  });
                }}
                sx={{ mr: 2 }}
              />
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  const updatedShifts = [...editedEmployee.schedule.customShifts];
                  updatedShifts.splice(index, 1);
                  setEditedEmployee({
                    ...editedEmployee,
                    schedule: { ...editedEmployee.schedule, customShifts: updatedShifts }
                  });
                }}
              >
                Remove
              </Button>
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setEditedEmployee({
                ...editedEmployee,
                schedule: {
                  ...editedEmployee.schedule,
                  customShifts: editedEmployee.schedule.customShifts
                    ? [...editedEmployee.schedule.customShifts, { day: '', startTime: '', endTime: '' }]
                    : [{ day: '', startTime: '', endTime: '' }]
                }
              });
            }}
            sx={{ mt: 2 }}
          >
            Add Custom Time
          </Button>

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
          <FormControl fullWidth margin="dense">
            <InputLabel>Days</InputLabel>
            <Select
              multiple
              value={newEmployee.schedule.days}
              onChange={handleDaysChange}
              label="Days"
              renderValue={(selected) => selected.join(', ')}
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <MenuItem key={day} value={day}>
                  <Checkbox checked={newEmployee.schedule.days.includes(day)} />
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="dense"
            label="Start Time"
            type="time"
            name="startTime"
            value={newEmployee.schedule.startTime}
            onChange={handleTimeChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="End Time"
            type="time"
            name="endTime"
            value={newEmployee.schedule.endTime}
            onChange={handleTimeChange}
          />
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
