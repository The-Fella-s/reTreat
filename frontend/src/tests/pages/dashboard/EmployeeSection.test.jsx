import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/';
import EmployeeSection from '../../../pages/dashboard/EmployeeSection';
import axios from 'axios';

jest.mock('axios');
Storage.prototype.getItem = jest.fn(() => 'dummy-token');

const sampleEmployees = [
    {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        email: 'john@example.com',
        employeeDetails: { profession: 'Engineer' },
        address: {
            street: '123 Main St',
            city: 'Somewhere',
            state: 'CA',
            postalCode: '90001',
            country: 'USA',
        },
        createdAt: '2023-01-01T00:00:00Z',
    },
    {
        _id: '2',
        name: 'Jane Smith',
        phone: '0987654321',
        email: 'jane@example.com',
        employeeDetails: { profession: { name: 'Designer' } },
        address: {
            street: '456 Side St',
            city: 'Elsewhere',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
        },
        createdAt: '2023-02-01T00:00:00Z',
    },
];

describe('EmployeeSection', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem('token', 'test-token');
    });

    test('renders employee data successfully after fetching', async () => {
        axios.get.mockResolvedValueOnce({ data: sampleEmployees });

        render(<EmployeeSection />);

        expect(await screen.findByText('John')).toBeInTheDocument();
        expect(await screen.findByText('Jane')).toBeInTheDocument();
        expect(screen.getByText('Employee Information')).toBeInTheDocument();
    });

    test('displays error message on fetch failure', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network Error'));

        render(<EmployeeSection />);

        expect(await screen.findByText('Failed to fetch employees.')).toBeInTheDocument();
    });

    test('opens edit dialog and pre-fills fields when clicking "Edit"', async () => {
        axios.get.mockResolvedValueOnce({ data: sampleEmployees });
        render(<EmployeeSection />);

        const editButtons = await screen.findAllByRole('button', { name: /Edit/i });
        expect(editButtons.length).toBeGreaterThan(0);

        fireEvent.click(editButtons[0]);

        await waitFor(() => {
            expect(screen.getByLabelText(/First Name/i)).toHaveValue('John');
            expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Doe');
            expect(screen.getByLabelText(/Phone/i)).toHaveValue('1234567890');
            expect(screen.getByLabelText(/Email/i)).toHaveValue('john@example.com');
            expect(screen.getByLabelText(/Profession/i)).toHaveValue('Engineer');
            expect(screen.getByLabelText(/Street/i)).toHaveValue('123 Main St');
        });
    });

    test('displays error message when saving updated employee fails', async () => {
        axios.get.mockResolvedValueOnce({ data: sampleEmployees });
        axios.put.mockRejectedValueOnce(new Error('Update error'));

        render(<EmployeeSection />);

        const editButtons = await screen.findAllByRole('button', { name: /Edit/i });
        fireEvent.click(editButtons[0]);

        const saveButton = screen.getByRole('button', { name: /Save/i });
        fireEvent.click(saveButton);

        expect(
            await screen.findByText('Failed to update employee. Please try again.')
        ).toBeInTheDocument();
    });

    test('clicking "Add Employee" successfully adds the employee', async () => {
        axios.get.mockResolvedValueOnce({ data: [] });  // For employees
        axios.get.mockResolvedValueOnce({ data: [] });  // For existing users

        axios.post.mockResolvedValueOnce({
            data: {
                _id: 'emp1',
                firstName: 'New',
                lastName: 'Employee',
                phone: '2222222222',
                email: 'new@example.com',
                profession: 'Developer',
                address: {
                    street: '456 New St',
                    city: 'Newcity',
                    state: 'NC',
                    postalCode: '67890',
                    country: 'Newland'
                },
                createdAt: '2023-10-15T00:00:00.000Z'
            }
        });

        await act(async () => {
            render(<EmployeeSection />);
        });

        const addEmployeeBtn = screen.getByRole('button', { name: /Add Employee/i });
        fireEvent.click(addEmployeeBtn);

        await waitFor(() => {
            expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'New' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Employee' } });
        fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '2222222222' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'new@example.com' } });
        fireEvent.change(screen.getByLabelText(/Profession/i), { target: { value: 'Developer' } });
        fireEvent.change(screen.getByLabelText(/Street/i), { target: { value: '456 New St' } });
        fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Newcity' } });
        fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'NC' } });
        fireEvent.change(screen.getByLabelText(/Postal Code/i), { target: { value: '67890' } });
        fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: 'Newland' } });

        const submitBtn = screen.getByRole('button', { name: /^Add Employee$/i });
        await act(async () => {
            fireEvent.click(submitBtn);
        });

        await waitFor(() => {
            expect(screen.getByText("new@example.com")).toBeInTheDocument();
        });
        expect(axios.post).toHaveBeenCalled();
    });

    test('clicking "Delete" successfully deletes the employee', async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                {
                    _id: 'emp1',
                    firstName: 'ToDelete',
                    lastName: 'Employee',
                    phone: '3333333333',
                    email: 'todelete@example.com',
                    employeeDetails: {},
                    address: { street: '789 Delete St', city: 'Deletecity', state: 'DL', postalCode: '00000', country: 'Deleteland' },
                    createdAt: '2023-10-15T00:00:00.000Z'
                }
            ]
        });

        await act(async () => {
            render(<EmployeeSection />);
        });

        await waitFor(() => {
            expect(screen.getByText(/todelete@example.com/i)).toBeInTheDocument();
        });

        axios.delete.mockResolvedValueOnce({});

        const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
        await act(async () => {
            fireEvent.click(deleteButtons[0]);
        });

        await waitFor(() => {
            expect(screen.queryByText(/todelete@example.com/i)).not.toBeInTheDocument();
        });
        expect(axios.delete).toHaveBeenCalled();
    });

    test('clicking "Edit" allows editing employee values and fields', async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                {
                    _id: 'emp1',
                    firstName: 'Old',
                    lastName: 'Name',
                    phone: '4444444444',
                    email: 'old@example.com',
                    employeeDetails: {},
                    address: { street: 'Old St', city: 'Oldcity', state: 'OS', postalCode: '11111', country: 'Oldland' },
                    createdAt: '2023-10-15T00:00:00.000Z'
                }
            ]
        });

        await act(async () => {
            render(<EmployeeSection />);
        });

        await waitFor(() => {
            expect(screen.getByText(/old@example.com/i)).toBeInTheDocument();
        });

        axios.put.mockResolvedValueOnce({
            data: {
                _id: 'emp1',
                firstName: 'New',
                lastName: 'Name',
                phone: '4444444444',
                email: 'old@example.com',
                profession: '',
                address: { street: 'New St', city: 'Newcity', state: 'NS', postalCode: '22222', country: 'Newland' },
                createdAt: '2023-10-15T00:00:00.000Z'
            }
        });

        const editButtons = screen.getAllByRole('button', { name: /Edit/i });
        fireEvent.click(editButtons[0]);

        await waitFor(() => {
            expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'New' } });
        fireEvent.change(screen.getByLabelText(/Street/i), { target: { value: 'New St' } });

        const saveBtn = screen.getByRole('button', { name: /Save/i });
        await act(async () => {
            fireEvent.click(saveBtn);
        });

        await waitFor(() => {
            const cellWithNewSt = screen.getAllByRole('gridcell').find((cell) =>
                cell.textContent.includes('New St')
            );
            expect(cellWithNewSt).toBeDefined();
        });
        expect(axios.put).toHaveBeenCalled();
    });

});
