import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VerifyEmail from '../../pages/VerifyEmail.jsx';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock toast and axios
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

// Mock localStorage
beforeEach(() => {
  localStorage.setItem('userId', 'mockUser123');
});

afterEach(() => {
  localStorage.clear();
});

test('renders verification form and submits code', async () => {
  axios.post.mockResolvedValue({ data: { message: 'Verified successfully!' } });

  render(
    <BrowserRouter>
      <VerifyEmail />
    </BrowserRouter>
  );

  const input = screen.getByLabelText(/Verification Code/i);
  const button = screen.getByRole('button', { name: /Verify Email/i });

  fireEvent.change(input, { target: { value: '123456' } });
  fireEvent.click(button);

  await waitFor(() =>
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/users/verify-email',
      {
        userId: 'mockUser123',
        code: '123456',
      }
    )
  );
});
