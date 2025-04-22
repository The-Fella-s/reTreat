import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import BookingSection from '../../../pages/dashboard/BookingSection.jsx';
import axios from 'axios';

jest.mock('axios');

// Mock the booking form to expose form values and an "Add" button
jest.mock('../../../components/BookingInputForm.jsx', () => (props) => {
    const { name, category, onAddService } = props;
    return (
        <div data-testid="booking-input-form">
            <div data-testid="form-name">{name}</div>
            <div data-testid="form-category">{category}</div>
            <button data-testid="add-button" onClick={onAddService}>
                Add
            </button>
        </div>
    );
});

// Mock each service card so we can click Edit/Delete
jest.mock('../../../components/AppointmentCardAdminEdit.jsx', () => (props) => {
    const { title, category, onEdit, onDelete } = props;
    return (
        <div data-testid="appointment-card">
            <span data-testid="title">{title}</span>
            <span data-testid="category">{category}</span>
            {onEdit && (
                <button
                    data-testid="edit-button"
                    onClick={() =>
                        onEdit({
                            _id: props._id || 'service1',
                            title,
                            category,
                            description: props.description,
                            duration: props.duration,
                            pricing: props.pricing,
                            image: props.image,
                        })
                    }
                >
                    Edit
                </button>
            )}
            {onDelete && (
                <button data-testid="delete-button" onClick={onDelete}>
                    Delete
                </button>
            )}
        </div>
    );
});

describe('BookingSection', () => {
    // Mock service
    const mockService = {
        _id: 'service1',
        name: 'Aqua Radiance Facial',
        category: { name: 'Facials' },
        description: 'Brightens skin',
        duration: 3600,
        pricing: 100,
        servicePicture: 'path.jpg',
    };

    // Clear all mock data before next test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('fetches categories and services on mount', async () => {
        // Mock service data
        axios.get
            .mockResolvedValueOnce({ data: { data: [{ name: 'Facials' }] } })
            .mockResolvedValueOnce({ data: [mockService] });

        // Render the page
        render(<BookingSection />);

        // Send both get requests to the endpoints
        expect(axios.get).toHaveBeenCalledWith(
            'http://localhost:5000/api/categories/list?source=mongo'
        );
        expect(axios.get).toHaveBeenCalledWith(
            'http://localhost:5000/api/services'
        );

        // Wait for the UI to reflect them
        await waitFor(() => {
            // Form starts blank
            expect(screen.getByTestId('form-name')).toHaveTextContent('');
            expect(screen.getByTestId('form-category')).toHaveTextContent('');

            // Preview card + One existing service card
            const cards = screen.getAllByTestId('appointment-card');
            expect(cards).toHaveLength(2);

            // Ensure our mock service shows up
            expect(screen.getByText('Aqua Radiance Facial')).toBeInTheDocument();
            expect(screen.getByText('Facials')).toBeInTheDocument();
        });
    });

    test('edit service populates form fields', async () => {
        // Mock service data
        axios.get
            .mockResolvedValueOnce({ data: { data: [{ name: 'Facials' }] } })
            .mockResolvedValueOnce({ data: [mockService] });

        // Render the page
        render(<BookingSection />);

        // Wait for the edit button to appear, then click it
        await waitFor(() => screen.getByTestId('edit-button'));
        fireEvent.click(screen.getByTestId('edit-button'));

        // Form should now show the service’s name & category
        await waitFor(() => {
            expect(screen.getByTestId('form-name')).toHaveTextContent(
                'Aqua Radiance Facial'
            );
            expect(screen.getByTestId('form-category')).toHaveTextContent('Facials');
        });
    });

    test('adds a new service', async () => {
        // Mock service data
        axios.get
            .mockResolvedValueOnce({ data: { data: [{ name: 'Facials' }] } })
            .mockResolvedValueOnce({ data: [mockService] });

        // Render the page
        render(<BookingSection />);

        // Wait for the input forms to load
        await waitFor(() =>
            expect(screen.getByTestId('booking-input-form')).toBeInTheDocument()
        );

        // Initiate new mock values
        axios.post.mockResolvedValueOnce({ data: {} });
        const newService = {
            ...mockService,
            _id: 'service2',
            name: 'Hydrating Glow Treatment',
        };

        // Populate mock values
        axios.get.mockResolvedValueOnce({ data: [mockService, newService] });

        // click “Add”
        fireEvent.click(screen.getByTestId('add-button'));

        await waitFor(() => {

            // Call the populate endpoint
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5000/api/services/populate',
                {
                    services: [
                        {
                            name: '',
                            category: '',
                            description: '',
                            pricing: '',
                            duration: '',
                            servicePicture: '',
                        },
                    ],
                }
            );

            // Check if there is a preview and 2 other cards
            const cards = screen.getAllByTestId('appointment-card');
            expect(cards).toHaveLength(3);
            expect(screen.getByText('Hydrating Glow Treatment')).toBeInTheDocument();
        });
    });

    test('deletes a service', async () => {
        // Mock service data
        axios.get
            .mockResolvedValueOnce({ data: { data: [{ name: 'Facials' }] } })
            .mockResolvedValueOnce({ data: [mockService] });

        // Render the page
        render(<BookingSection />);

        // Wait for delete button to load up
        await waitFor(() => screen.getByTestId('delete-button'));

        // Click on the delete button
        axios.delete.mockResolvedValueOnce({});
        fireEvent.click(screen.getByTestId('delete-button'));

        // Wait until there is only preview card showing and nothing else
        await waitFor(() => {
            const cards = screen.getAllByTestId('appointment-card');
            expect(cards).toHaveLength(1);
        });
    });
});
