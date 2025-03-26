// __tests__/Menu.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import SpaMenuPage from '../pages/menu'; // <-- Adjust import path
import { ToastContainer } from 'react-toastify';

jest.mock('axios');

describe('SpaMenuPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders menu items and categories from API', async () => {
    // Mock data
    const mockServices = [
      { name: 'Swedish Massage', description: 'Relaxing massage', pricing: 100, category: 'Massage' },
      { name: 'Deep Tissue', description: 'Intense massage', pricing: 120, category: 'Massage' },
      { name: 'Basic Facial', description: 'Cleansing facial', pricing: 80, category: 'Facial' },
    ];
    axios.get.mockResolvedValueOnce({ data: mockServices });

    render(
      <BrowserRouter>
        <ToastContainer />
        <SpaMenuPage />
      </BrowserRouter>
    );

    // Wait for the items to load
    expect(await screen.findByText('Swedish Massage')).toBeInTheDocument();
    expect(screen.getByText('Deep Tissue')).toBeInTheDocument();
    expect(screen.getByText('Basic Facial')).toBeInTheDocument();

    // Check that category buttons are rendered (All, Massage, Facial)
    expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Massage/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Facial/i })).toBeInTheDocument();
  });

  test('filters menu items by category', async () => {
    const mockServices = [
      { name: 'Swedish Massage', description: 'Relaxing massage', pricing: 100, category: 'Massage' },
      { name: 'Basic Facial', description: 'Cleansing facial', pricing: 80, category: 'Facial' },
    ];
    axios.get.mockResolvedValueOnce({ data: mockServices });

    render(
      <BrowserRouter>
        <ToastContainer />
        <SpaMenuPage />
      </BrowserRouter>
    );

    // Wait for the items to load
    expect(await screen.findByText('Swedish Massage')).toBeInTheDocument();
    expect(screen.getByText('Basic Facial')).toBeInTheDocument();

    // Click on the "Facial" category
    fireEvent.click(screen.getByRole('button', { name: /Facial/i }));

    // Now only "Basic Facial" should be visible
    expect(screen.queryByText('Swedish Massage')).not.toBeInTheDocument();
    expect(screen.getByText('Basic Facial')).toBeInTheDocument();
  });

  test('adds an item to the cart (mock POST) and shows success toast', async () => {
    const mockServices = [
      { name: 'Swedish Massage', description: 'Relaxing massage', pricing: 100, category: 'Massage' },
    ];
    axios.get.mockResolvedValueOnce({ data: mockServices });

    // Mock POST
    axios.post.mockResolvedValueOnce({ data: { message: 'Added to cart' } });

    render(
      <BrowserRouter>
        <ToastContainer />
        <SpaMenuPage />
      </BrowserRouter>
    );

    // Wait for the item to appear
    const itemTitle = await screen.findByText('Swedish Massage');
    expect(itemTitle).toBeInTheDocument();

    // Click "Purchase"
    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    fireEvent.click(purchaseButton);

    // Verify axios.post was called with correct data
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/carts/add/service',
      {
        email: 'jordan@example.com',
        serviceName: 'Swedish Massage',
        quantity: 1,
      }
    );

    // Toast success
    await waitFor(() => {
      expect(screen.getByText(/swedish massage added to cart/i)).toBeInTheDocument();
    });
  });

  test('navigates to cart page when "Book Appointment" is clicked', async () => {
    // We can spy on useNavigate, or just check if the button is present
    const mockServices = [];
    axios.get.mockResolvedValueOnce({ data: mockServices });

    render(
      <BrowserRouter>
        <SpaMenuPage />
      </BrowserRouter>
    );

    // "Book Appointment" button
    const bookBtn = screen.getByRole('button', { name: /book appointment/i });
    expect(bookBtn).toBeInTheDocument();
  });
});
