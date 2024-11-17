import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';

// Dummy data for employees
const employeesData = [
    {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St, Springfield',
        phone: '+1 555-1234',
        schedule: 'Mon-Fri: 9 AM - 5 PM',
    },
    {
        firstName: 'Jane',
        lastName: 'Smith',
        address: '456 Oak Ave, Springfield',
        phone: '+1 555-5678',
        schedule: 'Mon-Wed: 8 AM - 4 PM',
    },
    {
        firstName: 'Mike',
        lastName: 'Johnson',
        address: '789 Pine Rd, Springfield',
        phone: '+1 555-9101',
        schedule: 'Tue-Sat: 10 AM - 6 PM',
    },
];

const EmployeeSection = () => {
    const [employees, setEmployees] = useState(employeesData);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [editedEmployee, setEditedEmployee] = useState({
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        schedule: '',
    });

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setEditedEmployee({ ...employee }); // Pre-fill the edit form with current data
    };

    const handleSave = () => {
        const updatedEmployees = employees.map((employee) =>
            employee === editingEmployee ? editedEmployee : employee
        );
        setEmployees(updatedEmployees);
        setEditingEmployee(null);
    };

    const handleCancel = () => {
        setEditingEmployee(null);
    };

    const handleChange = (e) => {
        setEditedEmployee({
            ...editedEmployee,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Employee Information
            </Typography>

            {/* Table to display employee data */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="employee data table">
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Schedule</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee, index) => (
                            <TableRow key={index}>
                                <TableCell>{employee.firstName}</TableCell>
                                <TableCell>{employee.lastName}</TableCell>
                                <TableCell>{employee.address}</TableCell>
                                <TableCell>{employee.phone}</TableCell>
                                <TableCell>{employee.schedule}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleEdit(employee)}>
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Form (Visible only if editing an employee) */}
            {editingEmployee && (
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Edit Employee Information
                    </Typography>
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={editedEmployee.firstName}
                        onChange={handleChange}
                        sx={{ marginBottom: 2, marginRight: 2 }}
                    />
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={editedEmployee.lastName}
                        onChange={handleChange}
                        sx={{ marginBottom: 2, marginRight: 2 }}
                    />
                    <TextField
                        label="Address"
                        name="address"
                        value={editedEmployee.address}
                        onChange={handleChange}
                        sx={{ marginBottom: 2, marginRight: 2 }}
                    />
                    <TextField
                        label="Phone Number"
                        name="phone"
                        value={editedEmployee.phone}
                        onChange={handleChange}
                        sx={{ marginBottom: 2, marginRight: 2 }}
                    />
                    <TextField
                        label="Schedule"
                        name="schedule"
                        value={editedEmployee.schedule}
                        onChange={handleChange}
                        sx={{ marginBottom: 2, marginRight: 2 }}
                    />

                    <Box sx={{ marginTop: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Save
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ marginLeft: 2 }}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default EmployeeSection;
