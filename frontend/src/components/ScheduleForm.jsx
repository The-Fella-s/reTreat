import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Grid } from '@mui/material';
import api from '../utilities/api';

const ScheduleForm = ({ open, onClose, fetchSchedules, schedule }) => {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    startPeriod: 'AM',
    endTime: '',
    endPeriod: 'PM'
  });

  useEffect(() => {
    if (schedule) {
      const [start, startMeridian] = schedule.startTime.split(' ');
      const [end, endMeridian] = schedule.endTime.split(' ');

      setFormData({
        date: schedule.date.split('T')[0],
        startTime: start,
        startPeriod: startMeridian,
        endTime: end,
        endPeriod: endMeridian
      });
    } else {
      setFormData({
        date: '',
        startTime: '',
        startPeriod: 'AM',
        endTime: '',
        endPeriod: 'PM'
      });
    }
  }, [schedule, open]);

  const handleSubmit = async () => {
    try {
      const formattedData = {
        date: formData.date,
        startTime: `${formData.startTime} ${formData.startPeriod}`,
        endTime: `${formData.endTime} ${formData.endPeriod}`
      };

      if (schedule) {
        await api.put(`/schedules/${schedule._id}`, formattedData);
      } else {
        await api.post('/schedules', formattedData);
      }

      fetchSchedules();
      onClose();
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{schedule ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <Grid container spacing={1} mt={1}>
          <Grid item xs={8}>
            <TextField
              margin="dense"
              label="Start Time (HH:MM)"
              type="text"
              fullWidth
              placeholder="08:30"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              select
              margin="dense"
              fullWidth
              value={formData.startPeriod}
              onChange={(e) => setFormData({ ...formData, startPeriod: e.target.value })}
            >
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="PM">PM</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Grid container spacing={1} mt={1}>
          <Grid item xs={8}>
            <TextField
              margin="dense"
              label="End Time (HH:MM)"
              type="text"
              fullWidth
              placeholder="12:00"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              select
              margin="dense"
              fullWidth
              value={formData.endPeriod}
              onChange={(e) => setFormData({ ...formData, endPeriod: e.target.value })}
            >
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="PM">PM</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleForm;
