import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Ensure cookies are sent
});

// Automatically add JWT token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================== EMPLOYEE SCHEDULE API ================== //

// Fetch all schedules (Admin or Employee)
export const getAllSchedules = async () => {
  try {
    const response = await API.get('/schedules');
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
};

// Fetch schedules for logged-in employee
export const getMySchedules = async () => {
  try {
    const response = await API.get('/schedules/my-schedules');
    return response.data;
  } catch (error) {
    console.error('Error fetching employee schedules:', error);
    throw error;
  }
};

// Create a new schedule
export const createSchedule = async (scheduleData) => {
  try {
    const response = await API.post('/schedules', scheduleData);
    return response.data;
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
};

// Update a schedule by ID
export const updateSchedule = async (scheduleId, updatedData) => {
  try {
    const response = await API.put(`/schedules/${scheduleId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
};

// Delete a schedule by ID
export const deleteSchedule = async (scheduleId) => {
  try {
    const response = await API.delete(`/schedules/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};

export default API;
