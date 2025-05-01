// src/tests/pages/Profile.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '../../components/Profile';
import { AuthContext } from '../../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');

const mockProfile = {
  id: 'u1',
  name: 'Alice',
  email: 'alice@example.com',
  phone: '1234567890'
};
const mockDate = '2025-04-01T00:00:00Z';
const mockWaivers = [
  {
    _id: 'w1',
    waiverType: 'browLash',
    dateSigned: mockDate,
    status: 'pending',
    formData: { field1: 'value1' }
  }
];

const renderProfile = () => {
  localStorage.setItem('token', 'fake-token');
  return render(
    <AuthContext.Provider value={{ user: { id: mockProfile.id } }}>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('ProfilePage', () => {
  beforeEach(() => {
    axios.get.mockReset();
    axios.put.mockReset();
  });

  test('loads and displays profile and waivers', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockProfile })
      .mockResolvedValueOnce({ data: mockWaivers });

    renderProfile();

    expect(screen.getByText(/Loading profile…/i)).toBeInTheDocument();

    await waitFor(() => screen.getByText(mockProfile.name));
    expect(screen.getByText(mockProfile.email)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.phone)).toBeInTheDocument();
    expect(screen.getByText(/My Waivers/i)).toBeInTheDocument();

    const expectedDate = new Date(mockDate).toLocaleDateString();
    expect(screen.getByText(new RegExp(`BrowLash — ${expectedDate}`))).toBeInTheDocument();
  });

  test('edits and saves profile', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockProfile })
      .mockResolvedValueOnce({ data: [] });

    renderProfile();
    await waitFor(() => screen.getByText(mockProfile.name));

    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Alice Cooper' }
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '0987654321' }
    });

    axios.put.mockResolvedValueOnce({
      data: { user: { ...mockProfile, name: 'Alice Cooper', phone: '0987654321' } }
    });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `/api/users/update-profile/${mockProfile.id}`,
        { name: 'Alice Cooper', phone: '0987654321' },
        expect.any(Object)
      );
      expect(screen.getByText('Alice Cooper')).toBeInTheDocument();
      expect(screen.getByText('0987654321')).toBeInTheDocument();
    });
  });
});
