import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import ThemeSection from '../../../pages/dashboard/ThemeSection.jsx';

// Mock child function
import { createCustomTheme } from '../../../utilities/themeUtils.js';

// Mock components
jest.mock('axios');

jest.mock('../../../utilities/themeUtils.js', () => ({
    createCustomTheme: jest.fn(),
}));

jest.mock('../../../components/ColorPickerComponent.jsx', () => (props) => (
    <div data-testid="color-picker">{props.title}</div>
));

jest.mock('../../../components/SavedThemesComponent.jsx', () => (props) => (
    <div data-testid="saved-theme">
        <span>{props.title}</span>
        <button onClick={props.handleActivate}>Activate</button>
        <button onClick={props.handleDelete}>Delete</button>
    </div>
));

describe('ThemeSection', () => {
    let setThemeMock;

    beforeEach(() => {
        jest.clearAllMocks();
        setThemeMock = jest.fn();
        global.fetch = jest.fn();
    });

    test('fetches and displays saved themes on mount', async () => {
        // Mock Light theme data
        const themes = [
            {
                _id: '1',
                name: 'Light',
                palette: {
                    primary: { main: '#fff' },
                    secondary: { main: '#000' },
                    text: { primary: '#111', secondary: '#222' },
                    background: { default: '#333' },
                },
            },
        ];
        axios.get.mockResolvedValueOnce({ data: themes });

        // Render the page
        render(<ThemeSection setTheme={setThemeMock} />);

        // Get the theme by having Axios mock a get request to the endpoint
        expect(axios.get).toHaveBeenCalledWith(
            '/api/themes'
        );

        // Wait for the Light theme to load up
        const lightTheme = await screen.findByText('Light');
        expect(lightTheme).toBeInTheDocument();
    });

    test('submits a new theme and appends it to the list', async () => {
        // Make sure there is no mock data
        axios.get.mockResolvedValueOnce({ data: [] });

        // Mock Dark theme data
        const newTheme = {
            _id: '2',
            name: 'Dark',
            palette: {
                primary: { main: '#000' },
                secondary: { main: '#fff' },
                text: { primary: '#aaa', secondary: '#bbb' },
                background: { default: '#222' },
            },
        };
        axios.post.mockResolvedValueOnce({ data: newTheme });

        // Render the page
        render(<ThemeSection setTheme={setThemeMock} />);

        // Wait for axios to be called
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        // Change name of theme to Dark
        const nameInput = screen.getByRole('textbox', { name: /Theme Name/i });
        fireEvent.change(nameInput, { target: { value: 'Dark' } });

        // Save theme
        fireEvent.click(screen.getByRole('button', { name: /Save Theme/i }));

        // Wait for axios to mock a post request
        await waitFor(() =>
            expect(axios.post).toHaveBeenCalledWith(
                '/api/themes',
                expect.objectContaining({ name: 'Dark' })
            )
        );

        // Wait for the Dark theme to load up
        const darkTheme = await screen.findByText('Dark');
        expect(darkTheme).toBeInTheDocument();
    });

    test('activates a theme on clicking “Activate”', async () => {
        // Mock Light theme data
        const themes = [
            {
                _id: '1',
                name: 'Light',
                palette: {
                    primary: { main: '#fff' },
                    secondary: { main: '#000' },
                    text: { primary: '#111', secondary: '#222' },
                    background: { default: '#333' },
                },
            },
        ];
        axios.get.mockResolvedValueOnce({ data: themes });

        // Mock data to activate the Light theme
        const activatedTheme = { ...themes[0], isActive: true };
        axios.put.mockResolvedValueOnce({ data: activatedTheme });
        createCustomTheme.mockReturnValue({ foo: 'bar' });

        // Render the page and wait for the Light theme to load up
        render(<ThemeSection setTheme={setThemeMock} />);
        await screen.findByText('Light');

        // Click the "Activate" button for the Light theme
        fireEvent.click(screen.getByText('Activate'));

        // Wait for axios to mock a PUT request for the new Light theme
        // And check if it is the same theme as the mock theme
        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                '/api/themes/1',
                { isActive: true }
            );
            expect(createCustomTheme).toHaveBeenCalledWith(activatedTheme);
            expect(setThemeMock).toHaveBeenCalledWith({ foo: 'bar' });
        });
    });

    test('deletes a theme on clicking “Delete”', async () => {
        // Mock Light theme data
        const themes = [
            {
                _id: '1',
                name: 'Light',
                palette: {
                    primary: { main: '#fff' },
                    secondary: { main: '#000' },
                    text: { primary: '#111', secondary: '#222' },
                    background: { default: '#333' },
                },
            },
        ];
        axios.get.mockResolvedValueOnce({ data: themes });

        // Mock successful delete response
        global.fetch.mockResolvedValueOnce({ ok: true });

        // Render the page and wait for the Light theme to load up
        render(<ThemeSection setTheme={setThemeMock} />);
        await screen.findByText('Light');

        // Click the "Delete" button for the Light theme
        fireEvent.click(screen.getByText('Delete'));

        // Wait for axios to mock a DELETE request for the new Light theme
        // And check if it does not exist anymore
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/themes/1',
                { method: 'DELETE' }
            );
            expect(screen.queryByText('Light')).not.toBeInTheDocument();
        });
    });

    test('handles error on initial fetch', async () => {
        // Spy on console.error so we can confirm it was called
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        // Make Axios mock a failed GET request
        axios.get.mockRejectedValueOnce(new Error('Fetch failed'));

        // Render the page
        render(<ThemeSection setTheme={setThemeMock} />);

        // Wait for console.error to be called with the expected message
        await waitFor(() =>
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error fetching themes:',
                expect.any(Error)
            )
        );
    });

    test('handles error on submit', async () => {
        // Make sure there is no mock data
        axios.get.mockResolvedValueOnce({ data: [] });

        // Spy on console.error so we can confirm it was called
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        // Make Axios mock a failed POST request
        axios.post.mockRejectedValueOnce(new Error('Save failed'));

        // Render the page
        render(<ThemeSection setTheme={setThemeMock} />);
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        // Fill in the theme name and click Save
        const nameInput = screen.getByRole('textbox', { name: /Theme Name/i });
        fireEvent.change(nameInput, { target: { value: 'Wonky' } });
        fireEvent.click(screen.getByRole('button', { name: /Save Theme/i }));

        // Wait for console.error to be called with the expected message
        await waitFor(() =>
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error saving theme:',
                expect.any(Error)
            )
        );
    });

    test('handles error on activate', async () => {
        // Mock Light theme data
        const themes = [
            {
                _id: '1',
                name: 'Light',
                palette: {
                    primary: { main: '#fff' },
                    secondary: { main: '#000' },
                    text: { primary: '#111', secondary: '#222' },
                    background: { default: '#333' },
                },
            },
        ];
        axios.get.mockResolvedValueOnce({ data: themes });

        // Spy on console.error so we can confirm it was called
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        // Make Axios mock a failed PUT request
        axios.put.mockRejectedValueOnce(new Error('Activate failed'));

        // Render the page, find the Light theme, and click on the "Activate" button
        render(<ThemeSection setTheme={setThemeMock} />);
        await screen.findByText('Light');
        fireEvent.click(screen.getByText('Activate'));

        // Wait for console.error to be called with the expected message
        await waitFor(() =>
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error activating theme:',
                expect.any(Error)
            )
        );
    });

    test('handles error on delete', async () => {
        // Prepare existing theme data
        const themes = [
            {
                _id: '1',
                name: 'Light',
                palette: {
                    primary: { main: '#fff' },
                    secondary: { main: '#000' },
                    text: { primary: '#111', secondary: '#222' },
                    background: { default: '#333' },
                },
            },
        ];
        axios.get.mockResolvedValueOnce({ data: themes });

        // Spy on console.error so we can confirm it was called
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        // Make fetch mock a failed DELETE request
        global.fetch.mockRejectedValueOnce(new Error('Delete failed'));

        // Render the page, find the Light theme, and click on the "Delete" button
        render(<ThemeSection setTheme={setThemeMock} />);
        await screen.findByText('Light');
        fireEvent.click(screen.getByText('Delete'));

        // Wait for console.error to be called with the expected message
        await waitFor(() =>
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error deleting theme:',
                expect.any(Error)
            )
        );
    });

});
