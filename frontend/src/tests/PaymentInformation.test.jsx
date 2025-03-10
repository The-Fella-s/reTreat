import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import PaymentInformation from '../components/PaymentInformation';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from "react-router-dom";



// Mock useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const renderWithRouter = () => {
    render(
        <Router>
            <PaymentInformation />
        </Router>
    );
};

test("shows error messages for missing required fields", async () => {
    renderWithRouter();

    const submitButton = screen.getByRole("button", { name: /Book Appointment/i });

    // Click on submit button without filling in the required fields
    fireEvent.click(submitButton);

    await waitFor(() => {
        // Check for error messages in the form
        expect(screen.getByText(/First Name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Last Name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Phone Number is required/i)).toBeInTheDocument();
    });
});

test("renders the form fields", () => {
    renderWithRouter();

    // Check if form fields are rendered
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cardholder Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Card Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expire Date \(MM\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CVV/i)).toBeInTheDocument();
});


test('accepts user input', async () => {
  render(
    <MemoryRouter>
      <PaymentInformation />
    </MemoryRouter>
  );
  
  const firstNameInput = screen.getByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const phoneInput = screen.getByLabelText(/phone/i);
  const emailInput = screen.getByLabelText(/email/i);

  // Simulate user input
  await userEvent.type(firstNameInput, 'John');
  await userEvent.type(lastNameInput, 'Doe');
  await userEvent.type(phoneInput, '1234567890');
  await userEvent.type(emailInput, 'john.doe@example.com');

  // Check if values are correctly updated
  expect(firstNameInput).toHaveValue('John');
  expect(lastNameInput).toHaveValue('Doe');
  expect(phoneInput).toHaveValue('1234567890');
  expect(emailInput).toHaveValue('john.doe@example.com');
});
  
test('navigate back when Go Back button is clicked', () => {
  const navigateMock = jest.fn();
  useNavigate.mockReturnValue(navigateMock);

  render(
    <MemoryRouter>
      <PaymentInformation />
    </MemoryRouter>
  );

  const goBackButton = screen.getByRole('button', { name: /Go Back/i });

  // Simulate click
  fireEvent.click(goBackButton);

  // Check if navigate was called
  expect(navigateMock).toHaveBeenCalledTimes(1);
});
