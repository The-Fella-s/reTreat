import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "../pages/Register";
import axios from "axios";

// Mock axios
jest.mock("axios");

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Register Component", () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  it("renders registration form fields", () => {
    renderWithRouter(<Register />);
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
  });

  it("shows validation error for weak password", async () => {
    renderWithRouter(<Register />);
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: "abc" },
    });
    expect(
      screen.getByText(/Password must be 8\+ chars, include an uppercase/i)
    ).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });

    renderWithRouter(<Register />);
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
