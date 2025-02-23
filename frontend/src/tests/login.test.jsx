import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import { AuthContext } from '../context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

const mockLogin = jest.fn();
const mockLogout = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles successful login', async () => {
    const mockUser = { name: 'Test User', role: 'employee' };
    axios.post.mockResolvedValueOnce({ data: { token: 'test-token', user: mockUser } });

    render(
      <AuthContext.Provider value={{ login: mockLogin, logout: mockLogout }}>
        <Router>
          <Login />
        </Router>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/Sign In/i));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ user: mockUser, token: 'test-token' });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles failed login', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    render(
      <AuthContext.Provider value={{ login: mockLogin, logout: mockLogout }}>
        <Router>
          <Login />
        </Router>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText(/Sign In/i));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
