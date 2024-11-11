import React, { useState, useEffect, useRef } from 'react';

import dayjs from 'dayjs';

import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Grid2 from '@mui/material/Grid2';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

import appointment from '../temporarydata/Appointment.jsx';
import { formatTimeToAmPm } from '../utilities/formatTime.js';

// Extracts the dates to be highlighted on Calendar
const extractHighlightedDates = (date) => {
    const year = date.year();
    const month = date.month() + 1; // DayJS month is 0-indexed
    const highlightedDates = [];

    appointment.forEach(({ appointments }) => {
        appointments.forEach(({ date }) => {
            const [appointmentYear, appointmentMonth, appointmentDay] = date.split("-").map(Number);
            if (appointmentYear === year && appointmentMonth === month) {
                highlightedDates.push(appointmentDay);
            }
        });
    });

    return highlightedDates;
};

// Extract individual available hours for a specific selected date
const getIndividualAvailableHours = (selectedDate) => {
    const formattedDate = selectedDate.format('YYYY-MM-DD');

    // Find the appointment for the selected date
    const appointmentData = appointment.flatMap(({ appointments }) => appointments);
    const appointmentForDate = appointmentData.find(({ date }) => date === formattedDate);

    // Extract individual hours from availability if the appointment exists
    if (appointmentForDate && appointmentForDate.employee && appointmentForDate.employee.availability) {
        const individualHours = [];
        appointmentForDate.employee.availability.forEach((time) => {
            // Format times to 12-hour AM/PM format
            individualHours.push(formatTimeToAmPm(time));
        });
        return individualHours;
    }

    // Return an empty array if no hours are available
    return [];
};

// Simulate fetching the highlighted dates based on the JSON data
const fetchHighlightedDays = (date, { signal }) => {
    return new Promise((resolve, reject) => {
        const daysToHighlight = extractHighlightedDates(date);

        const timeout = setTimeout(() => {
            resolve({ daysToHighlight });
        }, 500);

        signal.onabort = () => {
            clearTimeout(timeout);
            reject(new DOMException('aborted', 'AbortError'));
        };
    });
};

// Day component to show highlighted days with an ❗
const ServerDay = ({ highlightedDays = [], day, outsideCurrentMonth, onSelect, ...other }) => {
    const isSelected = !outsideCurrentMonth && highlightedDays.includes(day.date());

    const handleClick = () => {
        onSelect(day); // Explicitly call the onSelect handler when a day is clicked
    };

    return (
        <Badge key={day.toString()} overlap="circular" badgeContent={isSelected ? '❗' : undefined}>
            <PickersDay
                {...other}
                outsideCurrentMonth={outsideCurrentMonth}
                day={day}
                onClick={handleClick} // Trigger the click handler
            />
        </Badge>
    );
};

export default function DateCalendarServerRequest() {
    const requestAbortController = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightedDays, setHighlightedDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [availableHours, setAvailableHours] = useState([]);

    const initialValue = dayjs('2024-11-01');

    // Fetch the highlighted days from JSON data
    const fetchDays = (date) => {
        const controller = new AbortController();
        fetchHighlightedDays(date, { signal: controller.signal })
            .then(({ daysToHighlight }) => {
                setHighlightedDays(daysToHighlight);
                setIsLoading(false);
            })
            .catch((error) => {
                if (error.name !== 'AbortError') console.error(error);
            });

        requestAbortController.current = controller;
    };

    useEffect(() => {
        setIsLoading(true);
        fetchDays(initialValue);

        return () => requestAbortController.current?.abort();
    }, []);

    // Handles clicking on the months, and then changes the days
    const handleMonthChange = (date) => {
        requestAbortController.current?.abort();
        setIsLoading(true);
        setHighlightedDays([]);
        fetchDays(date);
    };

    // Handles changing the highlighted days and available hours
    const handleDaySelect = (day) => {
        const hours = getIndividualAvailableHours(day);
        setAvailableHours(hours);
        setSelectedDay(day);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid2 container direction="column" alignItems="center">

                {/* The calendar */}
                <DateCalendar
                    defaultValue={initialValue}
                    loading={isLoading}
                    onMonthChange={handleMonthChange}
                    renderLoading={() => <DayCalendarSkeleton />}
                    slots={{
                        day: (props) => <ServerDay {...props} onSelect={handleDaySelect} />,
                    }}
                    slotProps={{
                        day: {
                            highlightedDays,
                        },
                    }}
                    sx={{ width: '300px', height: '300px' }}
                />

                {/* Shows available hours if there is more than one available hour */}
                {selectedDay && availableHours.length > 0 && (
                    <Grid2
                        sx={{
                            marginTop: '20px',
                            display: 'flex',
                            flexDirection: 'column',  // Stack the items vertically
                            alignItems: 'center',     // Center everything horizontally
                            justifyContent: 'center', // Center everything vertically (if necessary)
                        }}
                    >
                        <Typography variant="h7">
                            Available Hours on {selectedDay.format("MMMM DD, YYYY")}:
                        </Typography>

                        {/* Center the buttons and put them into two columns with spacing between */}
                        <Grid2
                            container
                            spacing={1}
                            sx={{
                                marginTop: '10px',
                                maxWidth: '200px',
                                justifyContent: 'center',  // Center buttons horizontally
                                alignItems: 'center',      // Center buttons vertically
                                display: 'grid',           // Use grid layout
                                gridTemplateColumns: 'repeat(2, 1fr)', // Two columns layout
                                gap: '8px',                // Space between items
                            }}
                        >

                            {/* Loops available hours and put them on buttons */}
                            {availableHours.map((hour, index) => (
                                <Button
                                    key={`${hour}-${index}`}
                                    sx={{
                                        width: '100px',  // Fixed width
                                        height: '30px',  // Fixed height
                                        textAlign: 'center',
                                    }}
                                    variant="outlined"
                                >
                                    <Typography variant="caption">{hour}</Typography>
                                </Button>
                            ))}
                        </Grid2>
                    </Grid2>
                )}

            </Grid2>
        </LocalizationProvider>
    );
}
