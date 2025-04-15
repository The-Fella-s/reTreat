// EmployeeSection.test.jsx

import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import EmployeeSection from '../pages/dashboard/EmployeeSection'; 
import axios from 'axios';

jest.mock('axios');
Storage.prototype.getItem = jest.fn(() => 'dummy-token');

describe('EmployeeSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    // --- Setup: Return one employee in the GET call.
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
    // --- Setup: Return one employee in GET call.
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