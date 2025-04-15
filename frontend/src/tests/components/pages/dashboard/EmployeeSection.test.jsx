import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/';
import EmployeeSection from '../../../../pages/dashboard/EmployeeSection';
import axios from 'axios';

jest.mock('axios');

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
        // Clear any previous mocks and set a test token in localStorage.
        jest.clearAllMocks();
        localStorage.setItem('token', 'test-token');
    });

    test('renders employee data successfully after fetching', async () => {
        axios.get.mockResolvedValueOnce({ data: sampleEmployees });

        render(<EmployeeSection />);

        // Wait for the first employee's first name to be rendered.
        expect(await screen.findByText('John')).toBeInTheDocument();

        // Also check for the second employee.
        expect(await screen.findByText('Jane')).toBeInTheDocument();

        // Check header
        expect(screen.getByText('Employee Information')).toBeInTheDocument();
    });

    test('displays error message on fetch failure', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network Error'));

        render(<EmployeeSection />);

        // The error message should appear when the API call fails.
        expect(await screen.findByText('Failed to fetch employees.')).toBeInTheDocument();
    });

    test('opens edit dialog and pre-fills fields when clicking "Edit"', async () => {
        axios.get.mockResolvedValueOnce({ data: sampleEmployees });
        render(<EmployeeSection />);

        // Wait for employee rows to render, then find the Edit buttons.
        const editButtons = await screen.findAllByRole('button', { name: /Edit/i });
        expect(editButtons.length).toBeGreaterThan(0);

        // Click the first Edit button (for "John Doe").
        fireEvent.click(editButtons[0]);

        // Check that the dialog fields have the employee’s data pre-filled.
        await waitFor(() => {
            expect(screen.getByLabelText(/First Name/i)).toHaveValue('John');
            expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Doe');
            expect(screen.getByLabelText(/Phone/i)).toHaveValue('1234567890');
            expect(screen.getByLabelText(/Email/i)).toHaveValue('john@example.com');
            expect(screen.getByLabelText(/Profession/i)).toHaveValue('Engineer');
            expect(screen.getByLabelText(/Street/i)).toHaveValue('123 Main St');
        });
    });

    test('updates employee data and reflects changes in DataGrid upon saving', async () => {
        axios.get.mockResolvedValueOnce({ data: sampleEmployees });
        axios.put.mockResolvedValueOnce({}); // simulate successful update

        render(<EmployeeSection />);

        // Open the edit dialog for the first employee.
        const editButtons = await screen.findAllByRole('button', { name: /Edit/i });
        fireEvent.click(editButtons[0]);

        // Change the first name and the street in the address.
        const firstNameInput = screen.getByLabelText(/First Name/i);
        fireEvent.change(firstNameInput, { target: { value: 'Johnny' } });

        const streetInput = screen.getByLabelText(/Street/i);
        fireEvent.change(streetInput, { target: { value: '456 Updated St' } });

        // Click the Save button.
        const saveButton = screen.getByRole('button', { name: /Save/i });
        fireEvent.click(saveButton);

        // Wait until the dialog closes.
        await waitFor(() => {
            expect(screen.queryByLabelText(/First Name/i)).toBeNull();
        });

        // Verify that axios.put was called with the correct endpoint and updated data.
        expect(axios.put).toHaveBeenCalledWith(
            `http://localhost:5000/api/employees/1`,
            expect.objectContaining({
                firstName: 'Johnny',
                address: expect.objectContaining({ street: '456 Updated St' }),
            }),
            { headers: { Authorization: 'Bearer test-token' } }
        );

        // The updated first name should be reflected in the DataGrid.
        await waitFor(() => {
            expect(screen.getByText('Johnny')).toBeInTheDocument();
        });

        // Also check that the updated formatted address is shown.
        await waitFor(() => {
            expect(
                screen.getByText('456 Updated St, Somewhere, CA 90001, USA')
            ).toBeInTheDocument();
        });
    });

    test('displays error message when saving updated employee fails', async () => {
        axios.get.mockResolvedValueOnce({ data: sampleEmployees });
        axios.put.mockRejectedValueOnce(new Error('Update error'));

        render(<EmployeeSection />);

        // Open the edit dialog for the first employee.
        const editButtons = await screen.findAllByRole('button', { name: /Edit/i });
        fireEvent.click(editButtons[0]);

        // Click Save without making changes.
        const saveButton = screen.getByRole('button', { name: /Save/i });
        fireEvent.click(saveButton);

        // The error message should appear after the failed update.
        expect(
            await screen.findByText('Failed to update employee. Please try again.')
        ).toBeInTheDocument();
    });

    test('deletes an employee and updates the grid', async () => {
        axios.get.mockResolvedValueOnce({ data: sampleEmployees });
        axios.delete.mockResolvedValueOnce({});

        render(<EmployeeSection />);

        // Wait until the employees are rendered in the grid.
        const deleteButtons = await screen.findAllByRole('button', { name: /Delete/i });
        expect(deleteButtons.length).toBeGreaterThan(0);

        // Click the Delete button for the first employee.
        fireEvent.click(deleteButtons[0]);

        // Wait until the first employee ("John") is removed from the DOM.
        await waitFor(() => {
            expect(screen.queryByText('John')).not.toBeInTheDocument();
        });

        // Verify axios.delete was called with the correct endpoint and token.
        expect(axios.delete).toHaveBeenCalledWith(
            `http://localhost:5000/api/employees/1`,
            { headers: { Authorization: 'Bearer test-token' } }
        );
    });
});
