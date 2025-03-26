import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import dayjs from 'dayjs';
import axios from 'axios';
import CalendarAndAvailableHours from '../components/CalendarAndAvailableHours';

jest.mock('axios');

describe('CalendarAndAvailableHours', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the calendar and no available hours for an unavailability day', async () => {
    const mockEmployees = [
      {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        schedule: {
          days: ['Monday', 'Tuesday'],
          startTime: '09:00',
          endTime: '10:00',
          customShifts: []
        }
      },
      {
        _id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        schedule: {
          days: ['Monday'],
          startTime: '09:30',
          endTime: '11:00',
          customShifts: []
        }
      }
    ];

    axios.get.mockResolvedValue({ data: mockEmployees });

    render(<CalendarAndAvailableHours />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    expect(screen.queryByText(/Available Hours on/i)).not.toBeInTheDocument();
  });

  test('renders available hours and calls onTimeSlotSelect when a timeslot is clicked', async () => {
    const mockEmployees = [
      {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        schedule: {
          days: ['Friday'],
          startTime: '09:00',
          endTime: '10:00',
          customShifts: []
        }
      }
    ];

    axios.get.mockResolvedValue({ data: mockEmployees });
    const onTimeSlotSelectMock = jest.fn();

    render(<CalendarAndAvailableHours onTimeSlotSelect={onTimeSlotSelectMock} />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    const headerText = await screen.findByText(/Available Hours on/i);
    expect(headerText).toBeInTheDocument();

    const timeSlotButton = await screen.findByRole('button', { name: /9:00 AM/i });
    expect(timeSlotButton).toBeInTheDocument();

    fireEvent.click(timeSlotButton);

    expect(onTimeSlotSelectMock).toHaveBeenCalledWith({
      date: 'November 01, 2024',
      time: '9:00 AM'
    });
  });
});
