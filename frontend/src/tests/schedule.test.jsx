import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmployeeSchedule from '../pages/EmployeeSchedule';
import { AuthContext } from '../context/AuthContext';
import api from '../utilities/api';

jest.mock('../utilities/api', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));

const mockUser = { name: 'Test User', role: 'employee' };

describe('Employee Schedule Page', () => {
    beforeEach(() => {
        api.get.mockResolvedValue({ data: [] });
        api.post.mockResolvedValue({ data: { message: 'Schedule created successfully' } });
        api.put.mockResolvedValue({ data: { message: 'Schedule updated successfully' } });
        api.delete.mockResolvedValue({ data: { message: 'Schedule deleted successfully' } });
    });

    it('can add a new schedule', async () => {
        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <EmployeeSchedule />
            </AuthContext.Provider>
        );

        fireEvent.click(screen.getByText(/Add New Schedule/i));

        await waitFor(() => {
            expect(screen.getByText('Save')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-02-22' } });
        fireEvent.change(screen.getByLabelText(/Start Time/i), { target: { value: '08:30' } });
        fireEvent.change(screen.getByLabelText(/End Time/i), { target: { value: '12:00' } });

        await act(async () => {
            fireEvent.click(screen.getByText('Save'));
        });

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/schedules', {
                date: '2025-02-22',
                startTime: '08:30 AM',
                endTime: '12:00 PM'
            });
        });
    });
});