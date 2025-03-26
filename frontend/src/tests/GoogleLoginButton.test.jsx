import React from 'react';
import { render, screen } from '@testing-library/react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess }) => (
    <button onClick={() => onSuccess({ credential: 'mockToken' })}>
      Mock Google Login
    </button>
  ),
}));

jest.mock('jwt-decode', () => jest.fn(() => ({
  email: 'test@example.com',
  name: 'Test User',
  picture: 'test.jpg',
  sub: 'abc123',
})));

jest.mock('axios');

test('calls Google login API and stores token', async () => {
  axios.post.mockResolvedValue({ data: { token: 'mock-jwt-token' } });

  // Spy on localStorage.setItem directly
  const setItemSpy = jest.spyOn(window.localStorage, 'setItem');
  setItemSpy.mockImplementation(() => {}); // prevent real setItem

  // Reset window.location for redirection
  delete window.location;
  window.location = { href: '' };

  render(<GoogleLoginButton />);

  const loginButton = screen.getByText('Mock Google Login');
  loginButton.click();

  // Wait briefly for async actions to complete
  await new Promise(resolve => setTimeout(resolve, 50));

  expect(axios.post).toHaveBeenCalledWith(
    'http://localhost:5000/api/users/google-login',
    expect.objectContaining({
      email: 'test@example.com',
      name: 'Test User',
      picture: 'test.jpg',
      sub: 'abc123',
    })
  );

  // Verify that setItem was called with the correct token
  expect(setItemSpy).toHaveBeenCalledWith('token', 'mock-jwt-token');
  expect(window.location.href).toBe('/profile');

  setItemSpy.mockRestore();
});
