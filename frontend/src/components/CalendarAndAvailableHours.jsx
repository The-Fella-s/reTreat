import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';

import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Grid2';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

import { formatTimeToAmPm } from '../utilities/formatTime.js';

// Given a selected day and the employees list, generate an array of objects.
// Each object contains a time slot (in 30 min increments) and an array of employee names available at that slot.
const getAvailableTimeSlotsForDay = (selectedDate, employees) => {
  const weekday = selectedDate.format('dddd');
  const dateStr = selectedDate.format('YYYY-MM-DD');
  const slotMapping = {}; // key: slot string, value: array of employee names

  employees.forEach(emp => {
    if (emp.schedule) {
      const fullName = `${emp.firstName} ${emp.lastName}`;
      // Process default schedule if applicable
      if (emp.schedule.days && emp.schedule.days.includes(weekday)) {
        let startTime = dayjs(`${dateStr} ${emp.schedule.startTime}`, 'YYYY-MM-DD HH:mm');
        const endTime = dayjs(`${dateStr} ${emp.schedule.endTime}`, 'YYYY-MM-DD HH:mm');
        while (startTime.isBefore(endTime)) {
          const slot = startTime.format('h:mm A');
          if (!slotMapping[slot]) {
            slotMapping[slot] = [];
          }
          if (!slotMapping[slot].includes(fullName)) {
            slotMapping[slot].push(fullName);
          }
          startTime = startTime.add(30, 'minute');
        }
      }
      // Process custom shifts if any for this weekday
      if (emp.schedule.customShifts && emp.schedule.customShifts.length > 0) {
        emp.schedule.customShifts.forEach(shift => {
          if (shift.day === weekday) {
            let startTime = dayjs(`${dateStr} ${shift.startTime}`, 'YYYY-MM-DD HH:mm');
            const endTime = dayjs(`${dateStr} ${shift.endTime}`, 'YYYY-MM-DD HH:mm');
            while (startTime.isBefore(endTime)) {
              const slot = startTime.format('h:mm A');
              if (!slotMapping[slot]) {
                slotMapping[slot] = [];
              }
              if (!slotMapping[slot].includes(fullName)) {
                slotMapping[slot].push(fullName);
              }
              startTime = startTime.add(30, 'minute');
            }
          }
        });
      }
    }
  });

  // Convert mapping into an array of objects and sort by time
  const slotsArray = Object.keys(slotMapping).map(slot => ({
    time: slot,
    employees: slotMapping[slot]
  }));

  slotsArray.sort((a, b) => dayjs(a.time, 'h:mm A').diff(dayjs(b.time, 'h:mm A')));
  return slotsArray;
};

// Custom day component that disables days with no availability.
// It receives a set of available weekdays (e.g., Monday, Tuesday, etc.)
const ServerDay = ({ availableWeekdays, day, outsideCurrentMonth, onSelect, ...other }) => {
  const weekday = day.format('dddd');
  const isAvailable = availableWeekdays.has(weekday);
  const handleClick = () => {
    if (isAvailable && !outsideCurrentMonth) {
      onSelect(day);
    }
  };

  return (
    <PickersDay
      {...other}
      disabled={!isAvailable || outsideCurrentMonth}
      day={day}
      onClick={handleClick}
    />
  );
};

export default function DateCalendarServerRequest() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [availableHours, setAvailableHours] = useState([]); // Now an array of {time, employees}
  const requestAbortController = useRef(null);
  const initialValue = dayjs('2024-11-01');

  // Fetch employees (with schedules) from backend
  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:5000/api/employees')
      .then(response => {
        setEmployees(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
        setIsLoading(false);
      });
  }, []);

  // Determine which weekdays have any availability by checking every employee.
  const availableWeekdays = new Set();
  employees.forEach(emp => {
    if (emp.schedule) {
      if (emp.schedule.days) {
        emp.schedule.days.forEach(day => availableWeekdays.add(day));
      }
      if (emp.schedule.customShifts) {
        emp.schedule.customShifts.forEach(shift => availableWeekdays.add(shift.day));
      }
    }
  });

  const handleMonthChange = (date) => {
    // Additional logic if needed.
  };

  // When a day is selected, generate available time slots (with employee names)
  const handleDaySelect = (day) => {
    setSelectedDay(day);
    const slots = getAvailableTimeSlotsForDay(day, employees);
    setAvailableHours(slots);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid2 container direction="column" alignItems="center">
        {/* Calendar Component */}
        <DateCalendar
          defaultValue={initialValue}
          loading={isLoading}
          onMonthChange={handleMonthChange}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: (props) => (
              <ServerDay
                {...props}
                availableWeekdays={availableWeekdays}
                onSelect={handleDaySelect}
              />
            ),
          }}
          sx={{ width: '300px', height: '300px' }}
        />

        {/* Display available hours if any */}
        {selectedDay && availableHours.length > 0 && (
          <Grid2
            container
            spacing={2}
            sx={{
              marginTop: '20px',
              maxWidth: '400px',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h7">
              Available Hours on {selectedDay.format("MMMM DD, YYYY")}:
            </Typography>
            {availableHours.map((slotObj, index) => (
              <Button
                key={`${slotObj.time}-${index}`}
                variant="outlined"
                sx={{
                  width: '150px',
                  minHeight: '80px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '8px'
                }}
              >
                <Typography variant="caption" sx={{ mb: 1 }}>
                  {slotObj.time}
                </Typography>
                {slotObj.employees.map((emp, i) => (
                  <Typography key={i} variant="caption" color="textSecondary" sx={{ lineHeight: '1.2', mb: 0.5 }}>
                    {emp}
                  </Typography>
                ))}
              </Button>
            ))}
          </Grid2>
        )}
      </Grid2>
    </LocalizationProvider>
  );
}
