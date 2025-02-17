import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Button, Box, CircularProgress, Card, CardContent, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import ScheduleForm from '../components/ScheduleForm';
import { AuthContext } from '../context/AuthContext';
import api from '../utilities/api';

const EmployeeSchedule = () => {
  const { user } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    if (user?.role === 'employee') {
      fetchSchedules();
    }
  }, [user]);

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/schedules/my-schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scheduleId) => {
    try {
      await api.delete(`/schedules/${scheduleId}`);
      setSchedules(schedules.filter((schedule) => schedule._id !== scheduleId));
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ textAlign: 'center', mt: 4, fontWeight: 'bold', color: '#1976d2' }}>
        Manage Your Schedule
      </Typography>

      <Box textAlign="center" my={3}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenForm(true)}>
          Add New Schedule
        </Button>
      </Box>

      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      ) : (
        schedules.map((schedule) => (
          <Card key={schedule._id} sx={{ my: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">📅 {new Date(schedule.date).toDateString()}</Typography>
              <Typography>🕒 {schedule.startTime} - {schedule.endTime}</Typography>

              <Box mt={2} display="flex" justifyContent="flex-end">
                <IconButton color="primary" onClick={() => { setEditingSchedule(schedule); setOpenForm(true); }}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(schedule._id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      <ScheduleForm open={openForm} onClose={() => { setOpenForm(false); setEditingSchedule(null); }} fetchSchedules={fetchSchedules} schedule={editingSchedule} />
    </Container>
  );
};

export default EmployeeSchedule;
