import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Login from "../../pages/Login.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

// MOCK GoogleLogin
jest.mock("@react-oauth/google", () => ({
  GoogleLogin: () => <div data-testid="mock-google-login">Mock Google Login</div>
}));

jest.mock("axios");

describe("Login Page", () => {
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();

  const mockUser = {
    email: "test@example.com",
    name: "Test User",
    phone: "1234567890",
    role: "user",
  };

  it("handles successful login and calls customer create endpoint when logging in is successful", async () => {
    axios.post.mockResolvedValueOnce({
      data: { token: "test-token", user: mockUser },
    });

    render(
      <AuthContext.Provider value={{ login: mockLogin, logout: mockLogout }}>
        <Router>
          <Login />
        </Router>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "TestPass123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/users/login",
        {
          email: "test@example.com",
          password: "TestPass123!",
        }
      );
    });
  });
});
