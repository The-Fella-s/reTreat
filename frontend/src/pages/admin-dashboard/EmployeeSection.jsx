import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Dummy data for employees
const employees = [
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
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Employee Information
      </Typography>
      
      {/* Centering the Table */}
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <TableContainer component={Paper} sx={{ maxWidth: 1000, width: '100%' }}>
          <Table sx={{ minWidth: 650 }} aria-label="employee data table">
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Schedule</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default EmployeeSection;
