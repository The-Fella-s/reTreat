import {render, screen, fireEvent, waitFor, within} from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import PaymentInformation from '../components/PaymentInformation';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

// Mock axios
jest.mock('axios');

// Mock react-toastify
jest.mock('react-toastify', () => ({
    ToastContainer: () => <div data-testid="toast-container" />,
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

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

test('successfully books appointment when card is retrieved', async () => {
    // Simulate axios GET resolving with a card id (card already exists)
    axios.get.mockResolvedValueOnce({ data: { card: { id: 'card123' } } });

    renderWithRouter();

    // Fill in required fields for User, Payment, and Billing Information
    await userEvent.type(screen.getByLabelText(/First Name/i), 'John');
    await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/Phone Number/i), '1234567890');
    await userEvent.type(screen.getByLabelText(/Email/i), 'john.doe@example.com');

    await userEvent.type(screen.getByLabelText(/Cardholder Name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/Card Number/i), '4242424242424242');
    await userEvent.type(screen.getByLabelText(/Expire Date \(MM\)/i), '12');
    await userEvent.type(screen.getByLabelText(/Expire Date \(YY\)/i), '25');
    await userEvent.type(screen.getByLabelText(/CVV/i), '123');

    await userEvent.type(screen.getByLabelText(/Address Line 1/i), '123 Main St');
    await userEvent.type(screen.getByLabelText(/City/i), 'Los Angeles');

    // Open the Select dropdown for the state (using the combobox role)
    const stateSelect = screen.getByRole("combobox");
    fireEvent.mouseDown(stateSelect);

    const caOption = await screen.findByRole("option", { name: 'CA' });
    fireEvent.click(caOption);

    await userEvent.type(screen.getByLabelText(/ZIP Code/i), '92345');
    await userEvent.type(screen.getByLabelText(/Country/i), 'USA');

    // Click the "Book Appointment" button
    const bookButton = screen.getByRole("button", { name: /Book Appointment/i });
    userEvent.click(bookButton);

    // Wait for the GET request to be called with the correct parameters
    await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
            'http://localhost:5000/api/cards/retrieve',
            { params: { email: 'john.doe@example.com' } }
        );
    });

    // Since a card was retrieved, the POST should not be called
    expect(axios.post).not.toHaveBeenCalled();
});

test('successfully books appointment when card is created', async () => {
    // Simulate GET returning 404 so that POST will be triggered
    axios.get.mockRejectedValueOnce({ response: { status: 404 } });
    // Simulate successful card creation via POST
    axios.post.mockResolvedValueOnce({ data: { id: 'cardNew' } });

    renderWithRouter();

    // Fill in required fields for User, Payment, and Billing Information
    await userEvent.type(screen.getByLabelText(/First Name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/Phone Number/i), '0987654321');
    await userEvent.type(screen.getByLabelText(/Email/i), 'jane.doe@example.com');

    await userEvent.type(screen.getByLabelText(/Cardholder Name/i), 'Jane Doe');
    await userEvent.type(screen.getByLabelText(/Card Number/i), '4242424242424242');
    await userEvent.type(screen.getByLabelText(/Expire Date \(MM\)/i), '11');
    await userEvent.type(screen.getByLabelText(/Expire Date \(YY\)/i), '26');
    await userEvent.type(screen.getByLabelText(/CVV/i), '456');

    await userEvent.type(screen.getByLabelText(/Address Line 1/i), '123 Main St');
    await userEvent.type(screen.getByLabelText(/City/i), 'Los Angeles');

    // Open the Select dropdown for the state (using the combobox role)
    const stateSelect = screen.getByRole("combobox");
    fireEvent.mouseDown(stateSelect);

    const caOption = await screen.findByRole("option", { name: 'CA' });
    fireEvent.click(caOption);

    await userEvent.type(screen.getByLabelText(/ZIP Code/i), '92345');
    await userEvent.type(screen.getByLabelText(/Country/i), 'USA');

    // Click the "Book Appointment" button
    const bookButton = screen.getByRole("button", { name: /Book Appointment/i });
    userEvent.click(bookButton);

    // Wait for the GET request
    await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
            'http://localhost:5000/api/cards/retrieve',
            { params: { email: 'jane.doe@example.com' } }
        );
    });

    // Wait for the POST request with the expected card data
    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:5000/api/cards/create',
            {
                email: 'jane.doe@example.com',
                cardholderName: 'Jane Doe',
                cardNumber: '4242424242424242',
                expMonth: '11',
                expYear: '26',
                cvv: '456',
                addressLine1: '123 Main St',
                addressLine2: '', // Not filled so remains an empty string
                administrativeDistrictLevel1: 'CA',
                country: 'USA',
                firstName: 'Jane',
                lastName: 'Doe',
                locality: 'Los Angeles',
                postalCode: '92345',
            }
        );
    });
});

test('displays error when card creation fails', async () => {
    // Simulate GET returning 404 to trigger card creation flow
    axios.get.mockRejectedValueOnce({ response: { status: 404 } });
    // Simulate POST failure with an error message
    const errorMessage = 'Card creation failed';
    axios.post.mockRejectedValueOnce({ response: { data: { error: errorMessage } } });

    // Spy on toast.error to verify that the error is displayed
    const toastErrorSpy = jest.spyOn(toast, 'error').mockImplementation(() => {});

    renderWithRouter();

    // Fill in required fields for User, Payment, and Billing Information
    await userEvent.type(screen.getByLabelText(/First Name/i), 'Alice');
    await userEvent.type(screen.getByLabelText(/Last Name/i), 'Smith');
    await userEvent.type(screen.getByLabelText(/Phone Number/i), '1112223333');
    await userEvent.type(screen.getByLabelText(/Email/i), 'alice.smith@example.com');

    await userEvent.type(screen.getByLabelText(/Cardholder Name/i), 'Alice Smith');
    await userEvent.type(screen.getByLabelText(/Card Number/i), '4242424242424242');
    await userEvent.type(screen.getByLabelText(/Expire Date \(MM\)/i), '10');
    await userEvent.type(screen.getByLabelText(/Expire Date \(YY\)/i), '24');
    await userEvent.type(screen.getByLabelText(/CVV/i), '789');

    await userEvent.type(screen.getByLabelText(/Address Line 1/i), '123 Main St');
    await userEvent.type(screen.getByLabelText(/City/i), 'Los Angeles');

    // Open the Select dropdown for the state (using the combobox role)
    const stateSelect = screen.getByRole("combobox");
    fireEvent.mouseDown(stateSelect);

    const caOption = await screen.findByRole("option", { name: 'CA' });
    fireEvent.click(caOption);

    await userEvent.type(screen.getByLabelText(/ZIP Code/i), '92345');
    await userEvent.type(screen.getByLabelText(/Country/i), 'USA');

    // Click the "Book Appointment" button
    const bookButton = screen.getByRole("button", { name: /Book Appointment/i });
    userEvent.click(bookButton);

    // Wait for the GET request
    await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
            'http://localhost:5000/api/cards/retrieve',
            { params: { email: 'alice.smith@example.com' } }
        );
    });

    // Wait for the POST request to have been attempted
    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    // Verify that the error toast was called with the error message
    await waitFor(() => {
        expect(toastErrorSpy).toHaveBeenCalledWith({ error: errorMessage });
    });

});
