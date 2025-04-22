import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Main from '../../../pages/Main';

// Mock react-player to expose its props as data-attributes
jest.mock('react-player', () => (props) => (
    <div
        data-testid="react-player"
        data-url={props.url}
        data-width={props.width}
        data-height={props.height}
        data-controls={String(props.controls)}
        style={props.style}
    />
));

// Mock child components
jest.mock('../../../components/SocialMedia',  () => () => <div data-testid="social-media" />);
jest.mock('../../../components/Reviews',      () => () => <div data-testid="reviews" />);
jest.mock('../../../components/ReadyToRelax', () => () => <div data-testid="ready-to-relax" />);

describe('Main component', () => {
    beforeEach(() => {
        render(<Main />);
    });

    test('renders the two header texts', () => {
        expect(
            screen.getByText(/Voted Best of the Best 3 Years in a Row!/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Welcome to reTreat Salon & Spa!/i)
        ).toBeInTheDocument();
    });

    test('renders ReactPlayer with correct props', () => {
        const player = screen.getByTestId('react-player');
        expect(player).toBeInTheDocument();

        // Verify that we passed the right URL
        expect(player).toHaveAttribute(
            'data-url',
            'https://www.youtube.com/watch?v=Q0F3Cp4OGW4?si=cTUz9fAer0dOwO1-'
        );

        // Verify size props
        expect(player).toHaveAttribute('data-width', '100%');
        expect(player).toHaveAttribute('data-height', '100%');

        // Verify controls enabled
        expect(player).toHaveAttribute('data-controls', 'true');
    });

    test('renders the Learn More button as a link to /about‑us', () => {
        const link = screen.getByRole('link', { name: /Learn More About Us!/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/about-us');
    });

    test('renders SocialMedia, Reviews, and ReadyToRelax components', () => {
        expect(screen.getByTestId('social-media')).toBeInTheDocument();
        expect(screen.getByTestId('reviews')).toBeInTheDocument();
        expect(screen.getByTestId('ready-to-relax')).toBeInTheDocument();
    });
});
