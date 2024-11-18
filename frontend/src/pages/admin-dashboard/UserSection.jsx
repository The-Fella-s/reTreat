import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Checkbox, Typography } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    flex: 2,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    flex: 2,
    editable: true,
  },
  {
    field: 'joinDate',
    headerName: 'Join Date',
    type: 'date',
    flex: 2,
    editable: true,
  },
  {
    field: 'employeeStatus',
    headerName: 'Employee Status',
    flex: 2,
    renderCell: (params) => (
      <Checkbox
        checked={params.value}
        onChange={(event) =>
          params.api.setEditCellValue({ id: params.id, field: 'employeeStatus', value: event.target.checked })
        }
        color="primary"
      />
    ),
    editable: false,
  },
];

const initialRows = [
  { id: 1, lastName: 'Scott', firstName: 'Tom', joinDate: new Date('2024-06-09'), employeeStatus: true },
  { id: 2, lastName: 'Doe', firstName: 'Jane', joinDate: new Date('2024-04-20'), employeeStatus: true },
  { id: 3, lastName: 'Zhang', firstName: 'San', joinDate: new Date('2010-09-22'), employeeStatus: false },
  { id: 4, lastName: 'Pan', firstName: 'Peter', joinDate: new Date('2000-04-22'), employeeStatus: false },
];

const UserSection = () => {
  const [rows, setRows] = useState(initialRows);

  const processRowUpdate = (newRow) => {
    setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? newRow : row)));
    return newRow;
  };

  return (
    <div>
      <Box sx={{padding: 3}}>
      <Typography variant="h4" gutterBottom>
        User Information
      </Typography>
      <p>Manage registered users, their data, and roles.</p>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          autoHeight
          checkboxSelection
          processRowUpdate={processRowUpdate}
        />
      </Box>
    </div>
  );
};

export default UserSection;
