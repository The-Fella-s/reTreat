import React from 'react';
import { render, screen } from '@testing-library/react';
import StatisticsSection from '../../../pages/dashboard/StatisticsSection.jsx';

// Mock out each of the child card components
jest.mock('../../../components/TotalUsersCard', () => (props) => (
    <div data-testid="TotalUsersCard" {...props}>
        TotalUsersCard
    </div>
));

jest.mock('../../../components/SignupsCard', () => (props) => (
    <div data-testid="SignupsCard" {...props}>
        SignupsCard
    </div>
));

jest.mock('../../../components/WebsiteVisitsCard', () => (props) => (
    <div data-testid="WebsiteVisitsCard" {...props}>
        WebsiteVisitsCard
    </div>
));

describe('StatisticsSection', () => {
    test('renders the Admin Dashboard heading', () => {
        // Render the page
        render(<StatisticsSection />);

        // The "Admin Dashboard" heading should be in the page
        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    test('renders all three statistic cards', () => {
        // Render the page
        render(<StatisticsSection />);

        // The different statistic cards should be in the page
        expect(screen.getByTestId('TotalUsersCard')).toBeInTheDocument();
        expect(screen.getByTestId('SignupsCard')).toBeInTheDocument();
        expect(screen.getByTestId('WebsiteVisitsCard')).toBeInTheDocument();
    });

    test('renders cards in the correct order', () => {
        // Render the page and store the data
        const { container } = render(<StatisticsSection />);

        // Return the elements in DOM order
        const cards = container.querySelectorAll('[data-testid$="Card"]');

        // There should be 3 cards
        // The first one should be the total users card
        // The second one should be the sign ups card
        // The third one should be the website visits card
        expect(cards).toHaveLength(3);
        expect(cards[0]).toHaveAttribute('data-testid', 'TotalUsersCard');
        expect(cards[1]).toHaveAttribute('data-testid', 'SignupsCard');
        expect(cards[2]).toHaveAttribute('data-testid', 'WebsiteVisitsCard');
    });
});
