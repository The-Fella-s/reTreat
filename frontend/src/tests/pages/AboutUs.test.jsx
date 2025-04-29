import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutUs from '../../pages/AboutUs';
import '@testing-library/jest-dom';


describe('AboutUs Page', () => {
    it('renders the main header', () => {
        render(<AboutUs />);
        const mainHeader = screen.getByText(/Welcome to reTreat Salon & Spa/i);
        expect(mainHeader).toBeInTheDocument();
    });

    it('renders the subheader with experience text', () => {
        render(<AboutUs />);
        const subHeader = screen.getByText(/Experience reTreat — a place to pause, exhale, and renew/i);
        expect(subHeader).toBeInTheDocument();
    });

    it('renders the owners section', () => {
        render(<AboutUs />);
        const ownersHeader = screen.getByText(/Meet the Owners of reTreat Salon & Spa/i);
        const ownersNames = screen.getByText(/Danniel & Holly/i);
        expect(ownersHeader).toBeInTheDocument();
        expect(ownersNames).toBeInTheDocument();
    });

    it('renders the mission and values section', () => {
        render(<AboutUs />);
        const missionHeader = screen.getByText(/Our mission and values/i);
        const missionText = screen.getByText(/Our Passion is Prioritizing Self Care!!/i);
        expect(missionHeader).toBeInTheDocument();
        expect(missionText).toBeInTheDocument();
    });

    it('renders the about reTreat section', () => {
        render(<AboutUs />);
        const aboutHeader = screen.getByText(/About reTreat/i);
        const aboutText = screen.getByText(/Welcome to reTreat! Our top priority is to help you reLax and reJuvenate./i);
        expect(aboutHeader).toBeInTheDocument();
        expect(aboutText).toBeInTheDocument();
    });

    it('renders the image of the owners', () => {
        render(<AboutUs />);
        const ownerImage = screen.getByAltText(/Danniel&Holly/i);
        expect(ownerImage).toBeInTheDocument();
    });

    it('renders the ReadyToRelax component', () => {
        render(<AboutUs />);
        const readyToRelaxText = screen.getByText(/Ready to Relax/i); // Assuming the ReadyToRelax component contains this text
        expect(readyToRelaxText).toBeInTheDocument();
    });
});