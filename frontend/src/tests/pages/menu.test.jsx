// __tests__/menu.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import SpaMenuPage from '../../pages/menu.jsx';
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

  test('Purchase button redirects to checkout page', async () => {
    const mockServices = [
      {
        name: 'Gift Card',
        description: 'Buy a gift card for someone special',
        pricing: 100,
        category: 'Purchase',
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockServices });
  
    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };
  
    render(
      <BrowserRouter>
        <SpaMenuPage />
      </BrowserRouter>
    );
  
    const purchaseButton = await screen.findByTestId('purchase-button');
    expect(purchaseButton).toBeInTheDocument();
  
    fireEvent.click(purchaseButton);
  
    expect(window.location.href).toBe('https://retreat-salon-and-spa.square.site/');
  });  
});
