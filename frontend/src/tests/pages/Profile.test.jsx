import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ProfilePage from "../../components/Profile.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from "axios";

jest.mock("axios");

beforeAll(() => {
  localStorage.setItem("token", "dummy-token");
});

afterAll(() => {
  localStorage.removeItem("token");
});

const fakeProfile = {
  _id: "123",
  name: "John Doe",
  email: "john@example.com",
  phone: "5555555555",
  profilePicture: "/uploads/test.jpg"
};

const renderProfilePage = (authValue = { user: { id: "123" } }) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={authValue}>
        <ProfilePage />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe("ProfilePage Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: fakeProfile });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    renderProfilePage();
    expect(screen.getByText(/Loading profile/i)).toBeInTheDocument();
  });

  it("fetches and displays user profile data", async () => {
    renderProfilePage({ user: { id: "123" } });
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/5555555555/i)).toBeInTheDocument();
  });

  it("toggles edit mode when clicking the edit button", async () => {
    renderProfilePage({ user: { id: "123" } });
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(screen.queryByLabelText(/Name/i)).not.toBeInTheDocument();
    const iconButtons = screen.getAllByRole("button");
    fireEvent.click(iconButtons[0]);
    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    });
  });
});
