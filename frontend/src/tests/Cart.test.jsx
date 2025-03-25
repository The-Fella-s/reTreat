// __tests__/Cart.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import ShoppingCart from '../pages/Cart'; // <-- Adjust import path
import { ToastContainer } from 'react-toastify';

jest.mock('axios');

describe('ShoppingCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays cart items on load', async () => {
    const mockCartData = {
      items: [
        {
          service: { _id: '1', name: 'Massage', pricing: 50, imageUrl: 'massage.png' },
          quantity: 2
        },
        {
          service: { _id: '2', name: 'Facial', pricing: 80, imageUrl: 'facial.png' },
          quantity: 1
        },
      ]
    };
    axios.get.mockResolvedValueOnce({ data: mockCartData });

    render(
      <BrowserRouter>
        <ToastContainer />
        <ShoppingCart />
      </BrowserRouter>
    );

    // Wait for items to appear
    expect(await screen.findByText('Massage')).toBeInTheDocument();
    expect(screen.getByText('Facial')).toBeInTheDocument();

    // Price checks
    expect(screen.getByText('Price: $50.00')).toBeInTheDocument();
    expect(screen.getByText('Price: $80.00')).toBeInTheDocument();

    // Quantity checks
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();

    // Total: (50 * 2) + (80 * 1) = 180
    expect(screen.getByText('Total: $180.00')).toBeInTheDocument();
  });

  test('removes an item from the cart', async () => {
    const mockCartData = {
      items: [
        {
          service: { _id: '1', name: 'Massage', pricing: 50 },
          quantity: 1
        },
      ]
    };
    axios.get.mockResolvedValueOnce({ data: mockCartData });

    // After removal, the cart is empty
    const mockAfterRemoval = { items: [] };
    axios.delete.mockResolvedValueOnce({ data: mockAfterRemoval });

    render(
      <BrowserRouter>
        <ToastContainer />
        <ShoppingCart />
      </BrowserRouter>
    );

    // Wait for item to appear
    expect(await screen.findByText('Massage')).toBeInTheDocument();

    // Click remove icon
    const removeButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(removeButton);

    // Verify the DELETE endpoint call
    expect(axios.delete).toHaveBeenCalledWith(
      'http://localhost:5000/api/carts/remove/service/67de456310bc38cfd38f660a/1'
    );

    // Cart should become empty
    await waitFor(() => {
      expect(screen.queryByText('Massage')).not.toBeInTheDocument();
    });
  });

  test('updates quantity and total price', async () => {
    const mockCartData = {
      items: [
        {
          service: { _id: '1', name: 'Massage', pricing: 50 },
          quantity: 1
        },
      ]
    };
    axios.get.mockResolvedValueOnce({ data: mockCartData });

    render(
      <BrowserRouter>
        <ToastContainer />
        <ShoppingCart />
      </BrowserRouter>
    );

    // Wait for item to appear
    const quantityInput = await screen.findByDisplayValue('1');
    expect(quantityInput).toBeInTheDocument();

    // Total initially
    expect(screen.getByText('Total: $50.00')).toBeInTheDocument();

    // Update quantity to 3
    fireEvent.change(quantityInput, { target: { value: '3' } });

    // Check that the displayed total changes accordingly
    // (Local state only; no direct API call in your code for quantity update)
    expect(screen.getByText('$150.00')).toBeInTheDocument();
    expect(screen.getByText('Total: $150.00')).toBeInTheDocument();
  });

  test('displays empty cart message', async () => {
    // Return empty cart
    axios.get.mockResolvedValueOnce({ data: { items: [] } });

    render(
      <BrowserRouter>
        <ShoppingCart />
      </BrowserRouter>
    );

    // Wait for the empty message
    expect(await screen.findByText('Your cart is empty.')).toBeInTheDocument();
  });
});
