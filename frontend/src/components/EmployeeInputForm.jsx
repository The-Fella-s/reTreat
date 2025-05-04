// src/components/EmployeeInputForm.jsx
import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Grid2, TextField, Button, Typography } from '@mui/material';

const EmployeeInputForm = ({ employee, onChange, onSubmit, isEditing }) => {
  const handleField = useCallback(e => {
    onChange(e.target.name, e.target.value);
  }, [onChange]);

  const handleFile = useCallback(e => {
    const file = e.target.files[0];
    if (!file) return;
    onChange('profilePictureFile', file);
    onChange('profilePicturePreview', URL.createObjectURL(file));
  }, [onChange]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {isEditing ? 'Edit Employee' : 'Add New Employee'}
        </Typography>

        <Grid2 container direction="column" spacing={2}>
          <Grid2 item>
            <TextField
              name="firstName"
              label="First Name"
              value={employee.firstName || ''}
              onChange={handleField}
              fullWidth size="small"
            />
          </Grid2>
          <Grid2 item>
            <TextField
              name="lastName"
              label="Last Name"
              value={employee.lastName || ''}
              onChange={handleField}
              fullWidth size="small"
            />
          </Grid2>
          <Grid2 item>
            <TextField
              name="email"
              label="Email"
              value={employee.email || ''}
              onChange={handleField}
              fullWidth size="small"
            />
          </Grid2>
          <Grid2 item>
            <TextField
              name="phone"
              label="Phone"
              value={employee.phone || ''}
              onChange={handleField}
              fullWidth size="small"
            />
          </Grid2>
          <Grid2 item>
            <TextField
              name="profession"
              label="Profession"
              value={employee.profession || ''}
              onChange={handleField}
              fullWidth size="small"
            />
          </Grid2>
          <Grid2 item>
            <TextField
              name="description"
              label="Description / Bio"
              value={employee.description || ''}
              onChange={handleField}
              fullWidth size="small"
              multiline rows={3}
            />
          </Grid2>

          <Grid2 item>
            <Typography variant="subtitle2" gutterBottom>
              Upload Profile Picture
            </Typography>
            <input type="file" accept="image/*" onChange={handleFile} />
          </Grid2>
          {employee.profilePicturePreview && (
            <Grid2 item>
              <img
                src={employee.profilePicturePreview}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: 150, marginTop: 8 }}
              />
            </Grid2>
          )}

          <Grid2 item>
            <Button onClick={onSubmit} variant="contained" fullWidth>
              {isEditing ? 'Save Employee' : 'Add Employee'}
            </Button>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
};

EmployeeInputForm.propTypes = {
  employee: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
};

export default memo(EmployeeInputForm);
