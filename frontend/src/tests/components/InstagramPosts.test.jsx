// InstagramPosts.test.jsx
import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import InstagramPosts from '../../components/InstagramPosts';
import axios from 'axios';

jest.mock('axios');

// Update framer-motion mock to pass event.detail to onDragEnd.
jest.mock('framer-motion', () => {
    const React = require('react');
    const FakeMotion = React.forwardRef((props, ref) => {
        const { children, dragConstraints, dragElastic, onDragEnd, ...rest } = props;
        const handleDragEnd = (e) => {
            const detail = e.detail || { offset: { x: 0 }, velocity: { x: 0 } };
            if (onDragEnd) {
                onDragEnd(e, detail);
            }
        };
        return (
            <div ref={ref} {...rest} onDragEnd={handleDragEnd}>
                {children}
            </div>
        );
    });
    return {
        motion: {
            div: FakeMotion,
            img: FakeMotion,
        },
        AnimatePresence: ({ children }) => <>{children}</>,
    };
});

describe('InstagramPosts Component', () => {
    const threePosts = {
        data: {
            data: [
                { media_url: 'https://example.com/image1.jpg' },
                { media_url: 'https://example.com/image2.jpg' },
                { media_url: 'https://example.com/image3.jpg' },
            ],
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('displays a loading spinner initially', () => {
        // Create a promise that never resolves.
        const neverResolvingPromise = new Promise(() => {});
        axios.get.mockReturnValueOnce(neverResolvingPromise);

        const { getByTestId } = render(<InstagramPosts />);
        expect(getByTestId('loading-spinner')).toBeInTheDocument();
    });

    test('displays "No posts available" when API returns an empty array', async () => {
        axios.get.mockResolvedValueOnce({ data: { data: [] } });
        const { findByTestId } = render(<InstagramPosts />);
        const emptyMessage = await waitFor(() => findByTestId('empty-message'));
        expect(emptyMessage).toHaveTextContent(/No posts available/i);
    });

    test('displays error message when API fails', async () => {
        // Suppress console.error to avoid noisy test output.
        jest.spyOn(console, 'error').mockImplementation(() => {});
        axios.get.mockRejectedValueOnce(new Error('Network Error'));
        const { findByTestId } = render(<InstagramPosts />);
        const errorMessage = await waitFor(() => findByTestId('error-message'));
        expect(errorMessage).toHaveTextContent(/Failed to fetch posts/i);
    });

    test('detects a left swipe (drag) to move to the next image', async () => {
        axios.get.mockResolvedValueOnce(threePosts);
        const { findByTestId } = render(<InstagramPosts />);
        // Wait for the current image to render.
        const currentImage = await waitFor(() => findByTestId('current-image'));
        expect(currentImage).toHaveAttribute('src', 'https://example.com/image1.jpg');

        // Simulate a left swipe: offset.x = -150, velocity.x = -1.
        const dragLeftEvent = new CustomEvent('dragend', {
            bubbles: true,
            detail: { offset: { x: -150 }, velocity: { x: -1 } },
        });

        await act(async () => {
            currentImage.dispatchEvent(dragLeftEvent);
        });

        // The carousel should now display the second image.
        const newCurrentImage = await waitFor(() => findByTestId('current-image'));
        expect(newCurrentImage).toHaveAttribute('src', 'https://example.com/image2.jpg');
    });

    test('detects a right swipe (drag) to move to the previous image', async () => {
        axios.get.mockResolvedValueOnce(threePosts);
        const { findByTestId } = render(<InstagramPosts />);
        const currentImage = await waitFor(() => findByTestId('current-image'));
        expect(currentImage).toHaveAttribute('src', 'https://example.com/image1.jpg');

        // Simulate a right swipe: offset.x = 150, velocity.x = 1.
        const dragRightEvent = new CustomEvent('dragend', {
            bubbles: true,
            detail: { offset: { x: 150 }, velocity: { x: 1 } },
        });

        await act(async () => {
            currentImage.dispatchEvent(dragRightEvent);
        });

        // From the first image, swiping right should wrap around to the last image.
        const newCurrentImage = await waitFor(() => findByTestId('current-image'));
        expect(newCurrentImage).toHaveAttribute('src', 'https://example.com/image3.jpg');
    });
});
