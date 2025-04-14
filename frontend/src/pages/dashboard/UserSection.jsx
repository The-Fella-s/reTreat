import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Checkbox, Typography } from '@mui/material';

const UserSection = () => {
  const [rows, setRows] = useState([]);

  // Utility: Retrieve auth token (if using protected endpoints)
  const getAuthToken = () => localStorage.getItem('token');

  // Fetch users and map them to the DataGrid row structure.
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw user data:', data);

      const mappedUsers = data.map((user) => {
        const nameParts = user.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        const joinDate = new Date(user.createdAt); // Ensure Date object

        return {
          id: user.id || user._id,
          firstName,
          lastName,
          joinDate,
          role: user.role,
          employeeStatus: user.role === 'employee', // explicit boolean for sorting
        };
      });

      setRows(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to toggle the role between "employee" and "user"
  const toggleEmployee = async (row) => {
    console.log(`Toggling role for user ${row.id}. Current role: ${row.role}`);
    // Toggle the role; if currently employee, set role to "user", otherwise set to "employee"
    const newRole = row.role === 'employee' ? 'user' : 'employee';
    // Also update the computed employeeStatus property.
    const updatedRow = { ...row, role: newRole, employeeStatus: newRole === 'employee' };

    try {
      const response = await fetch(`http://localhost:5000/api/users/${row.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(updatedRow),
      });

      if (!response.ok) {
        console.error('PUT request failed with status:', response.status);
        throw new Error('Failed to update user role.');
      }

      const updatedUser = await response.json();
      console.log('Updated user from backend:', updatedUser);

      // Map the updated user to our row structure
      const nameParts = updatedUser.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const joinDate = new Date(updatedUser.createdAt);

      const mappedUpdatedUser = {
        id: updatedUser.id || updatedUser._id,
        firstName,
        lastName,
        joinDate,
        role: updatedUser.role,
        employeeStatus: updatedUser.role === 'employee',
      };

      // Update local state with the updated row
      setRows((prevRows) =>
          prevRows.map((r) => (r.id === mappedUpdatedUser.id ? mappedUpdatedUser : r))
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Columns definition, including a sortable employeeStatus column
  const columns = [
    { field: 'id', headerName: 'ID', width: 90, minWidth: 90 },
    {
      field: 'firstName',
      headerName: 'First name',
      flex: 2,
      minWidth: 150,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      flex: 2,
      minWidth: 150,
      editable: true,
    },
    {
      field: 'joinDate',
      headerName: 'Join Date',
      type: 'date',
      flex: 2,
      minWidth: 150,
      editable: true,
    },
    {
      field: 'employeeStatus',
      headerName: 'Employee Status',
      flex: 2,
      minWidth: 150,

      // Allow sorting on employeeStatus.
      sortable: true,
      sortComparator: (v1, v2) => {
        // For sorting, we want true (employee) to come before false.
        // If both are equal, return 0; otherwise, return -1 if v1 is true.
        if (v1 === v2) return 0;
        return v1 ? -1 : 1;
      },
      renderCell: (params) => {
        // Use the stored employeeStatus field
        const isEmployee = params.row.employeeStatus;
        console.log(`Rendering row ${params.row.id}: role=${params.row.role} (employeeStatus=${isEmployee})`);
        return (
            <Checkbox
                checked={isEmployee}
                onClick={(e) => {
                  // Prevent the click from triggering row selection
                  e.stopPropagation();
                  toggleEmployee(params.row);
                }}
                color="primary"
            />
        );
      },
      editable: false,
    },
  ];

  // Process row updates for other fields if needed
  const processRowUpdate = async (newRow) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${newRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      const updatedUser = await response.json();
      const nameParts = updatedUser.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const joinDate = new Date(updatedUser.createdAt);

      const mappedUpdatedUser = {
        id: updatedUser.id || updatedUser._id,
        firstName,
        lastName,
        joinDate,
        role: updatedUser.role,
        employeeStatus: updatedUser.role === 'employee',
      };

      setRows((prevRows) =>
          prevRows.map((row) => (row.id === mappedUpdatedUser.id ? mappedUpdatedUser : row))
      );

      return mappedUpdatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return newRow;
    }
  };

  return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Information
        </Typography>
        <p>Manage registered users, their data, and roles.</p>
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              autoHeight
              processRowUpdate={processRowUpdate}
          />
        </Box>
      </Box>
  );
};

export default UserSection;
