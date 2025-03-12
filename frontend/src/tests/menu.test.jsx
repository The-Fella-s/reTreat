import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SpaMenuPage from '../pages/menu'; // Make sure the path and filename match
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

// Mock toast and react-router-dom's useNavigate
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
  ToastContainer: ({ children }) => <div>{children}</div>,
}));

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('SpaMenuPage Component', () => {
  beforeEach(() => {
    mockedNavigate.mockReset();
    toast.success.mockClear();
  });

  test('renders header and filter buttons', () => {
    render(
      <BrowserRouter>
        <SpaMenuPage />
      </BrowserRouter>
    );
    // Check that header is rendered
    expect(screen.getByText(/Menu/i)).toBeInTheDocument();

    // Use getByRole for the filter buttons to avoid "multiple elements" error
    expect(screen.getByRole('button', { name: /^All$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Packages$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Subscriptions$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Lounge$/i })).toBeInTheDocument();
  });

  test('displays correct items based on selected filter', () => {
    render(
      <BrowserRouter>
        <SpaMenuPage />
      </BrowserRouter>
    );

    // Expect items from all categories to be visible initially
    expect(screen.getByText(/Deluxe Spa Package/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Membership/i)).toBeInTheDocument();

    // Click the "Packages" filter button
    fireEvent.click(screen.getByRole('button', { name: /^Packages$/i }));

    // Now only items with category "Packages" should be present
    expect(screen.getByText(/Deluxe Spa Package/i)).toBeInTheDocument();
    expect(screen.getByText(/Luxury Spa Package/i)).toBeInTheDocument();
    expect(screen.getByText(/Customizable Spa Package/i)).toBeInTheDocument();
    // Items from other categories should not be rendered
    expect(screen.queryByText(/Monthly Membership/i)).toBeNull();
  });

  test('handles purchase click: displays toast and navigates', async () => {
    render(
      <BrowserRouter>
        <SpaMenuPage />
      </BrowserRouter>
    );

    // Find purchase buttons
    const purchaseButtons = screen.getAllByRole('button', { name: /Purchase/i });
    expect(purchaseButtons.length).toBeGreaterThan(0);

    // Click the first purchase button
    fireEvent.click(purchaseButtons[0]);

    // Wait for side effects
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining('booking initiated')
      );
      expect(mockedNavigate).toHaveBeenCalledWith('/appointment');
    });
  });
});
