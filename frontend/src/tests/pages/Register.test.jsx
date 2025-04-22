import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Register from "../../pages/Register.jsx";
import { renderWithAuth } from "../utilities/testHelper.js";

// ✅ Mock axios for testing purposes
jest.mock("axios");

// ✅ Mock GoogleLogin to avoid hook errors during testing
jest.mock("@react-oauth/google", () => ({
  GoogleLogin: () => <div data-testid="mock-google-login">Mock Google Login</div>
}));

describe("Register Component", () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  it("renders registration form fields", () => {
    renderWithAuth(<Register />);

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByTestId("mock-google-login")).toBeInTheDocument(); // verify mocked login rendered
  });

  it("shows validation error for weak password", async () => {
    renderWithAuth(<Register />);
    
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: "abc" },
    });

    expect(
      screen.getByText(/Password must be 8\+ chars, include uppercase/i)
    ).toBeInTheDocument();
  });

  it("submits form with valid data and calls registration endpoint when successful", async () => {
    // Simulate a successful registration response
    axios.post.mockResolvedValueOnce({ status: 201 });

    renderWithAuth(<Register />);
    
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: "StrongPass1!" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "5555555555" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/users/register",
        {
          email: "jane@example.com",
          password: "StrongPass1!",
          name: "Jane Doe",
          phone: "5555555555",
        }
      );
    });
  });
});
