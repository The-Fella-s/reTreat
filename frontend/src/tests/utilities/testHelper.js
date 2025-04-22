// src/tests/testHelpers.js
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

// Create a mock context value with dummy functions
const mockAuthContextValue = {
  user: null,
  setUser: jest.fn(),
  login: jest.fn(),
  loginWithToken: jest.fn(), // Dummy function to avoid errors in Register component
  logout: jest.fn(),
};

// Reusable render helper that wraps the UI with BrowserRouter and AuthContext.Provider
export const renderWithAuth = (ui, contextValue = mockAuthContextValue) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={contextValue}>
        {ui}
      </AuthContext.Provider>
    </BrowserRouter>
  );
};
