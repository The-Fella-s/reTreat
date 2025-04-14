import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Autocomplete } from '@mui/material';
import axios from 'axios';

const EmployeeSection = () => {
  const [rows, setRows] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState({});

   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
   const [newEmployee, setNewEmployee] = useState({
     firstName: '',
     lastName: '',
     phone: '',
     email: '',
     profession: '',                   
     address: {                      
       street: '',
       city: '',
       state: '',
       postalCode: '',
       country: ''
     }
   });


   const [existingUsers, setExistingUsers] = useState([]);
   const [selectedUser, setSelectedUser] = useState(null);


  // Utility: Retrieve auth token
  const getAuthToken = () => localStorage.getItem('token');

  // Fetch employees from API and map to row structure.
  const fetchEmployees = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const mappedRows = response.data.map((user) => {

        // Extract first and last names.
        const firstName = user.firstName || (user.name ? user.name.split(' ')[0] : '');
        const lastName =
            user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : '');

        // Extract profession as a string (if it's a populated object, get its name).
        const profession =
            user.employeeDetails && user.employeeDetails.profession
                ? typeof user.employeeDetails.profession === 'object'
                    ? user.employeeDetails.profession.name
                    : user.employeeDetails.profession
                : '';

        // Get the raw address object and also format it for display.
        const addr = user.address || {};
        const formattedAddress = `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.postalCode || ''}, ${addr.country || ''}`;
        return {
          id: user._id,
          firstName,
          lastName,
          phone: user.phone || '',
          email: user.email || '',
          profession,
          formattedAddress,
          address: addr, // raw address object used for editing
          joinDate: user.createdAt ? new Date(user.createdAt) : null,
        };
      });

      setRows(mappedRows);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setErrorMessage('Failed to fetch employees.');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);


   const fetchExistingUsers = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Assuming response.data is an array of user objects.
      setExistingUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Opens the Edit dialog with employee data pre-filled.
  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setEditedEmployee(employee);
  };

  // Delete employee and update DataGrid rows.
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  // Save updated employee. Update the row's formatted address as well.
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/employees/${editingEmployee.id}`, editedEmployee, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      setRows((prevRows) =>
          prevRows.map((row) =>
              row.id === editingEmployee.id
                  ? {
                    ...editedEmployee,
                    formattedAddress: `${editedEmployee.address.street}, ${editedEmployee.address.city}, ${editedEmployee.address.state} ${editedEmployee.address.postalCode}, ${editedEmployee.address.country}`
                  }
                  : row
          )
      );
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      setErrorMessage('Failed to update employee. Please try again.');
    }
  };

  // Handle changes for basic (non-nested) fields.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee({ ...editedEmployee, [name]: value });
  };

  // Handle changes for address fields.
  const handleEditAddressChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee((prev) => ({
      ...prev,
      address: { ...(prev.address || {}), [name]: value }
    }));
  };


  // Open Add Employee dialog
  const handleOpenAddDialog = () => {
    setNewEmployee({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      profession: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      }
    });
    setSelectedUser(null); // Reset selected user
    setIsAddDialogOpen(true);
    fetchExistingUsers(); 
  };
  // Handle changes in Add Employee form.
  const handleAddEmployeeChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewEmployee((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}),
          [child]: value
        }
      }));
    } else {
      setNewEmployee((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };


   const handleSelectUser = (event, user) => {
    setSelectedUser(user);
    if (user) {
      // Autofill the employee form with data from the selected user.
      setNewEmployee((prev) => ({
        ...prev,
        firstName: user.firstName || (user.name ? user.name.split(' ')[0] : ''),
        lastName: user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : ''),
        phone: user.phone || '',
        email: user.email || '',
        profession: user.profession || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          postalCode: user.address?.postalCode || '',
          country: user.address?.country || ''
        }
      }));
    }
  };

  const handleCreateEmployee = async () => {
    try {
      const token = getAuthToken();
      let createdEmployee;
      
      if (selectedUser) {
        const updatePayload = {
          ...newEmployee, 
          role: 'employee'
        };
        
        const response = await axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, updatePayload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        createdEmployee = response.data;
      } else {
        const employeePayload = {
          ...newEmployee,
          password: "password", 
          role: 'employee',               
          schedule: { days: [], startTime: '', endTime: '', customShifts: [] } 
        };
        const response = await axios.post('http://localhost:5000/api/employees', employeePayload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        createdEmployee = response.data;
      }
      
      // Map the returned data to a new row for the DataGrid
      const newRow = {
        id: createdEmployee._id,
        firstName: createdEmployee.firstName || newEmployee.firstName,
        lastName: createdEmployee.lastName || newEmployee.lastName, 
        phone: createdEmployee.phone,
        email: createdEmployee.email,
        profession: createdEmployee.profession,
        formattedAddress: `${createdEmployee.address?.street || ''}, ${createdEmployee.address?.city || ''}, ${createdEmployee.address?.state || ''} ${createdEmployee.address?.postalCode || ''}, ${createdEmployee.address?.country || ''}`,
        address: createdEmployee.address,
        joinDate: createdEmployee.createdAt ? new Date(createdEmployee.createdAt) : null,
      };
      setRows((prevRows) => [...prevRows, newRow]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error creating employee:', error);
      setErrorMessage('Failed to add employee. Please try again.');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90, minWidth: 90 },
    { field: 'firstName', headerName: 'First Name', flex: 1, minWidth: 150 },
    { field: 'lastName', headerName: 'Last Name', flex: 1, minWidth: 150 },
    { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
    { field: 'profession', headerName: 'Profession', flex: 1, minWidth: 150 },
    { field: 'formattedAddress', headerName: 'Address', flex: 1, minWidth: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
          <>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleEditClick(params.row)}
                style={{ marginRight: 8 }}
            >
              Edit
            </Button>
            <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </Button>
          </>
      )
    },
  ];

  return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Employee Information
        </Typography>
        {errorMessage && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errorMessage}
            </Typography>
        )}
        <Box sx={{ marginBottom: 2 }}>
             <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAddDialog}  // Adds employee when clicked
              >
              Add Employee
            </Button>
        </Box>
        <Box sx={{ height: 500, width: '100%', overflowX: 'auto' }}>
          <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              autoHeight
          />
        </Box>

        {/* Edit Employee Dialog */}
        <Dialog open={Boolean(editingEmployee)} onClose={() => setEditingEmployee(null)} fullWidth>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogContent>
            <TextField
                margin="dense"
                name="firstName"
                label="First Name"
                fullWidth
                value={editedEmployee.firstName || ''}
                onChange={handleChange}
            />
            <TextField
                margin="dense"
                name="lastName"
                label="Last Name"
                fullWidth
                value={editedEmployee.lastName || ''}
                onChange={handleChange}
            />
            <TextField
                margin="dense"
                name="phone"
                label="Phone"
                fullWidth
                value={editedEmployee.phone || ''}
                onChange={handleChange}
            />
            <TextField
                margin="dense"
                name="email"
                label="Email"
                fullWidth
                value={editedEmployee.email || ''}
                onChange={handleChange}
            />
            <TextField
                margin="dense"
                name="profession"
                label="Profession"
                fullWidth
                value={editedEmployee.profession || ''}
                onChange={handleChange}
            />
            {/* Address Edit Section */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Address
              </Typography>
              <TextField
                  margin="dense"
                  name="street"
                  label="Street"
                  fullWidth
                  value={editedEmployee.address?.street || ''}
                  onChange={handleEditAddressChange}
              />
              <TextField
                  margin="dense"
                  name="city"
                  label="City"
                  fullWidth
                  value={editedEmployee.address?.city || ''}
                  onChange={handleEditAddressChange}
              />
              <TextField
                  margin="dense"
                  name="state"
                  label="State"
                  fullWidth
                  value={editedEmployee.address?.state || ''}
                  onChange={handleEditAddressChange}
              />
              <TextField
                  margin="dense"
                  name="postalCode"
                  label="Postal Code"
                  fullWidth
                  value={editedEmployee.address?.postalCode || ''}
                  onChange={handleEditAddressChange}
              />
              <TextField
                  margin="dense"
                  name="country"
                  label="Country"
                  fullWidth
                  value={editedEmployee.address?.country || ''}
                  onChange={handleEditAddressChange}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingEmployee(null)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        {/* Add Employee Dialog */}
        <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} fullWidth>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={existingUsers}
            getOptionLabel={(option) =>
              `${option.firstName || option.name || ''} ${option.lastName || ''}`.trim()
            }
            onChange={handleSelectUser}
            value={selectedUser}
            renderOption={(props, option, { index }) => (
              <li
                {...props}
                key={option._id ? option._id : `${option.email}-${index}`}
              >
                {`${option.firstName || option.name || ''} ${option.lastName || ''}`.trim()}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Search Existing Users" margin="dense" />
            )}
          />
          {/* Employee fields that can be auto-filled */}
          <TextField
            margin="dense"
            name="firstName"
            label="First Name"
            fullWidth
            value={newEmployee.firstName}
            onChange={handleAddEmployeeChange}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            fullWidth
            value={newEmployee.lastName}
            onChange={handleAddEmployeeChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            fullWidth
            value={newEmployee.phone}
            onChange={handleAddEmployeeChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            fullWidth
            value={newEmployee.email}
            onChange={handleAddEmployeeChange}
          />
          <TextField
            margin="dense"
            name="profession"
            label="Profession"
            fullWidth
            value={newEmployee.profession}
            onChange={handleAddEmployeeChange}
          />
          {/* Address Section */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Address
            </Typography>
            <TextField
              margin="dense"
              name="address.street"
              label="Street"
              fullWidth
              value={newEmployee.address.street || ''}
              onChange={handleAddEmployeeChange}
            />
            <TextField
              margin="dense"
              name="address.city"
              label="City"
              fullWidth
              value={newEmployee.address.city || ''}
              onChange={handleAddEmployeeChange}
            />
            <TextField
              margin="dense"
              name="address.state"
              label="State"
              fullWidth
              value={newEmployee.address.state || ''}
              onChange={handleAddEmployeeChange}
            />
            <TextField
              margin="dense"
              name="address.postalCode"
              label="Postal Code"
              fullWidth
              value={newEmployee.address.postalCode || ''}
              onChange={handleAddEmployeeChange}
            />
            <TextField
              margin="dense"
              name="address.country"
              label="Country"
              fullWidth
              value={newEmployee.address.country || ''}
              onChange={handleAddEmployeeChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateEmployee} variant="contained" color="primary">
            Add Employee
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeSection;
