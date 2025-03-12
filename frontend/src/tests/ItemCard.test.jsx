import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ItemCard from '../components/ItemCard';

describe('ItemCard Component', () => {
  const sampleProps = {
    name: 'Test Item',
    description: 'Line one\nLine two',
    price: '$100',
    onPurchase: jest.fn(),
  };

  test('renders name, description, and price correctly', () => {
    render(<ItemCard {...sampleProps} />);
    
    // Check that the name is rendered
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    // Check that each line in the description is rendered
    expect(screen.getByText('Line one')).toBeInTheDocument();
    expect(screen.getByText('Line two')).toBeInTheDocument();
    // Check that the price is rendered
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  test('calls onPurchase when purchase button is clicked', () => {
    render(<ItemCard {...sampleProps} />);
    const purchaseButton = screen.getByRole('button', { name: /Purchase/i });
    
    // Click the purchase button
    fireEvent.click(purchaseButton);
    
    // Expect the onPurchase function to have been called once
    expect(sampleProps.onPurchase).toHaveBeenCalled();
  });
});
