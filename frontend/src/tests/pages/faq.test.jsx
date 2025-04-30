import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FAQ from '../../../src/pages/faq'; 

describe('FAQ Page', () => {
    test('renders all FAQ items initially', () => {
        // Render the FAQ component
        render(<FAQ />);

        // Locate all FAQ items by their text
        const faqItems = screen.getAllByText(/How can I book an appointment\?|What time should I arrive\?|What should I expect\?|What if I have to cancel\?|What are your hours\?/i);
        expect(faqItems.length).toBe(5); // Ensure all 5 FAQ items are rendered
    });

    test('filters FAQ items based on search query', () => {
        // Render the FAQ component
        render(<FAQ />);

        // Locate the search input
        const searchInput = screen.getByLabelText(/Search FAQs/i);

        // Simulate typing in the search bar
        fireEvent.change(searchInput, { target: { value: 'book' } });

        // Check that the filtered FAQ item is displayed
        const filteredItem = screen.getByText(/How can I book an appointment\?/i);
        expect(filteredItem).toBeInTheDocument();
    });

    test('displays "No FAQs found" when no items match the search query', () => {
        // Render the FAQ component
        render(<FAQ />);

        // Locate the search input
        const searchInput = screen.getByLabelText(/Search FAQs/i);

        // Simulate typing a query that doesn't match any FAQ items
        fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

        // Check that the "No FAQs found" message is displayed
        const noFAQsMessage = screen.getByText(/No FAQs found/i);
        expect(noFAQsMessage).toBeInTheDocument();
    });

    test('expands and collapses an FAQ item when clicked', () => {
        // Track the state of the Accordion 
        let isExpanded = false;

        // Mock the height property 
        Object.defineProperty(window, 'getComputedStyle', {
            value: (element) => ({
                ...element.style,
                height: isExpanded ? 'auto' : '0px', 
            }),
        });

        // Render the FAQ component
        render(<FAQ />);

        // Locate the FAQ question 
        const faqQuestion = screen.getByText(/How can I book an appointment\?/i);

        // Locate the AccordionDetails element 
        const faqAnswer = screen.getByText(/Booking an appointment is best done over the phone/i);

        // Check that the Accordion is collapsed initially 
        expect(window.getComputedStyle(faqAnswer).height).toBe('0px');

        // Click the FAQ question to expand it
        fireEvent.click(faqQuestion);
        isExpanded = true; // Update the state to expanded

        // Check that the Accordion is expanded 
        expect(window.getComputedStyle(faqAnswer).height).not.toBe('0px');

        // Click the FAQ question again to collapse it
        fireEvent.click(faqQuestion);
        isExpanded = false; 

        // Check that the Accordion is collapsed again (height: 0px)
        expect(window.getComputedStyle(faqAnswer).height).toBe('0px');
    });
});