import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';

// Dummy data for employees
const employeesData = [
  { firstName: 'John', lastName: 'Doe', address: '123 Main St', phone: '555-1234', schedule: 'Mon-Fri: 9 AM - 5 PM' },
  { firstName: 'Jane', lastName: 'Smith', address: '456 Oak Ave', phone: '555-5678', schedule: 'Mon-Wed: 8 AM - 4 PM' },
  { firstName: 'Mike', lastName: 'Johnson', address: '789 Pine Rd', phone: '555-9101', schedule: 'Tue-Sat: 10 AM - 6 PM' },
];

const EmployeeSection = () => {
  const [employees, setEmployees] = useState(employeesData);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState({});

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setEditedEmployee({ ...employee });
  };

  const handleSave = () => {
    const updatedEmployees = employees.map((e) =>
      e === editingEmployee ? editedEmployee : e
    );
    setEmployees(updatedEmployees);
    setEditingEmployee(null);
  };

  const handleCancel = () => setEditingEmployee(null);

  const handleChange = (e) => {
    setEditedEmployee({ ...editedEmployee, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Information
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee, idx) => (
              <TableRow key={idx}>
                <TableCell>{employee.firstName}</TableCell>
                <TableCell>{employee.lastName}</TableCell>
                <TableCell>{employee.address}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.schedule}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleEdit(employee)}>Edit</Button>
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
    </Box>
  );
};

export default EmployeeSection;
