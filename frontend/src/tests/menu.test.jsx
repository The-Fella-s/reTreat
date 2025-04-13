// __tests__/menu.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import SpaMenuPage from '../pages/menu';
import { ToastContainer } from 'react-toastify';

jest.mock('axios');

describe('SpaMenuPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders menu items and categories from API', async () => {
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

    expect(await screen.findByText('Swedish Massage')).toBeInTheDocument();
    expect(screen.getByText('Deep Tissue')).toBeInTheDocument();
    expect(screen.getByText('Basic Facial')).toBeInTheDocument();

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

    expect(await screen.findByText('Swedish Massage')).toBeInTheDocument();
    expect(screen.getByText('Basic Facial')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Facial/i }));

    expect(screen.queryByText('Swedish Massage')).not.toBeInTheDocument();
    expect(screen.getByText('Basic Facial')).toBeInTheDocument();
  });

  test('adds an item to the cart (mock POST) and shows success toast', async () => {
    const mockServices = [
      { name: 'Swedish Massage', description: 'Relaxing massage', pricing: 100, category: 'Massage' },
    ];
    axios.get.mockResolvedValueOnce({ data: mockServices });
    axios.post.mockResolvedValueOnce({ data: { message: 'Added to cart' } });

    render(
      <BrowserRouter>
        <ToastContainer />
        <SpaMenuPage />
      </BrowserRouter>
    );

    const itemTitle = await screen.findByText('Swedish Massage');
    expect(itemTitle).toBeInTheDocument();

    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    fireEvent.click(purchaseButton);

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/carts/add/service',
      {
        email: 'jordan@example.com',
        serviceName: 'Swedish Massage',
        quantity: 1,
      }
    );

    await waitFor(() => {
      expect(screen.getByText(/swedish massage added to cart/i)).toBeInTheDocument();
    });
  });
});
