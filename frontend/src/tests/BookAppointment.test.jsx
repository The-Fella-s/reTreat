import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import BookAppointment from '../../../frontend/src/pages/BookAppointment';
import '@testing-library/jest-dom';

jest.mock('axios');

jest.mock('../../../frontend/src/components/AppointmentCard', () => {
  return ({ onAppointmentBookConfirm }) => (
    <button onClick={onAppointmentBookConfirm}>Book Appointment</button>
  );
});

describe('BookAppointment', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('redirects to Square Checkout API on booking confirmation', async () => {
    const mockServices = [
      {
        _id: '1',
        name: 'Massage',
        description: 'Relaxing massage service',
        pricing: '50',
        duration: 60, 
        servicePicture: 'dummy.jpg',
        category: { name: 'Body Treatments' }
      }
    ];
    const mockCategories = {
      data: {
        data: [
          { name: 'Body Treatments' },
          { name: 'Skin Care' }
        ]
      }
    };

    axios.get
      .mockResolvedValueOnce({ data: mockServices })
      .mockResolvedValueOnce(mockCategories);

    render(
      <MemoryRouter>
        <BookAppointment />
      </MemoryRouter>
    );

    const bookingButton = await waitFor(() =>
      screen.getByRole('button', { name: 'Book Appointment' })
    );
    expect(bookingButton).toBeInTheDocument();

    // User presses book appointment
    fireEvent.click(bookingButton);

    // Verifies the redirect to Square Checkout API
    expect(window.location.href).toBe('https://retreat-salon-and-spa.square.site/');
  });
});
