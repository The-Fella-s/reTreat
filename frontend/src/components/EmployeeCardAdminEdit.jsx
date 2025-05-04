// src/components/EmployeeCardAdminEdit.jsx
import React, { useState } from 'react';
import {
  Card, CardActions, CardContent, CardMedia,
  Button, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import PropTypes from 'prop-types';

const EmployeeCardAdminEdit = ({ employee, isPreview, onEdit, onDelete }) => {
  const [openDetail,  setOpenDetail]  = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  return (
    <>
      <Card sx={{ width:300, display:'flex', flexDirection:'column', height:'100%' }}>
        {employee.profilePicture && (
          <CardMedia
            component="img"
            height="200"
            image={employee.profilePicture}
            alt={`${employee.firstName} ${employee.lastName}`}
            sx={{ objectFit: 'cover' }}
          />
        )}
        <CardContent sx={{ flexGrow:1 }}>
          <Typography variant="h6">
            {employee.firstName} {employee.lastName}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {employee.profession}
          </Typography>
          {employee.description && (
            <Typography variant="body2" noWrap sx={{ my:1 }}>
              {employee.description}
            </Typography>
          )}
          <Typography variant="body2">📞 {employee.phone}</Typography>
          <Typography variant="body2">✉️ {employee.email}</Typography>
        </CardContent>

        <CardActions sx={{ justifyContent:'space-between' }}>
          {!isPreview && onEdit && (
            <Button size="small" onClick={() => onEdit(employee)}>Edit</Button>
          )}
          <Button size="small" onClick={() => setOpenDetail(true)}>Details</Button>
          {!isPreview && onDelete && (
            <Button size="small" color="error" onClick={() => setOpenConfirm(true)}>
              Delete
            </Button>
          )}
        </CardActions>
      </Card>

      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} fullWidth>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <strong>Name:</strong> {employee.firstName} {employee.lastName}
          </Typography>
          <Typography gutterBottom>
            <strong>Profession:</strong> {employee.profession}
          </Typography>
          {employee.description && (
            <Typography gutterBottom>
              <strong>Description:</strong> {employee.description}
            </Typography>
          )}
          <Typography gutterBottom><strong>Phone:</strong> {employee.phone}</Typography>
          <Typography gutterBottom><strong>Email:</strong> {employee.email}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Delete {employee.firstName} {employee.lastName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button
            onClick={() => { onDelete(employee._id); setOpenConfirm(false); }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

EmployeeCardAdminEdit.propTypes = {
  employee: PropTypes.object.isRequired,
  isPreview: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default EmployeeCardAdminEdit;
