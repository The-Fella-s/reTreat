import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WaiverSection from '../../../pages/dashboard/WaiverSection'; 
import axios from 'axios';
import { toast } from 'react-toastify';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

describe('WaiverSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // stub out token retrieval
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: jest.fn(() => 'fake-token') },
      writable: true
    });
  });

  it('fetches and displays waivers', async () => {
    const waivers = [
      {
        _id: '1',
        waiverType: 'General',
        formData: { firstName: 'John', lastName: 'Doe' },
        dateSigned: '2025-05-01T12:00:00Z',
        status: 'pending',
        envelopeId: null,
      },
    ];
    axios.get.mockResolvedValueOnce({ data: waivers });

    render(<WaiverSection />);

    // initial loading state
    expect(screen.getByText('Loading waivers…')).toBeInTheDocument();

    // after fetch completes, table header shows up
    await waitFor(() => screen.getByText('Waiver Requests'));

    // data cells
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(
      screen.getByText(new Date(waivers[0].dateSigned).toLocaleDateString())
    ).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();

    // action buttons for a pending waiver
    expect(screen.getByRole('button', { name: /^Approve$/ })).toBeEnabled();
    expect(screen.getByRole('button', { name: /^Reject$/ })).toBeEnabled();
  });

  it('approves a waiver when Approve button is clicked', async () => {
    const waiver = {
      _id: '1',
      waiverType: 'General',
      formData: { firstName: 'John', lastName: 'Doe' },
      dateSigned: '2025-05-01T12:00:00Z',
      status: 'pending',
      envelopeId: null,
    };

    // first GET returns pending, second GET returns approved
    axios.get
      .mockResolvedValueOnce({ data: [waiver] })
      .mockResolvedValueOnce({ data: [{ ...waiver, status: 'approved' }] });
    axios.put.mockResolvedValue({ data: { success: true } });

    render(<WaiverSection />);
    await waitFor(() => screen.getByText('John Doe'));

    fireEvent.click(screen.getByRole('button', { name: /^Approve$/ }));

    // PUT was called with the right URL + headers
    expect(axios.put).toHaveBeenCalledWith(
      `/api/waivers/1/approve`,
      {},
      { headers: { Authorization: 'Bearer fake-token' } }
    );

    // toast and re-fetch triggered
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Waiver approved!');
      expect(screen.getByText('approved')).toBeInTheDocument();
    });
  });

  it('shows an error toast if initial fetch fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    render(<WaiverSection />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load waivers.');
    });
  });
});
