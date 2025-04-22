import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WaiverForm from "../../pages/waiver.jsx"; // adjust the path if needed
import axios from "axios";
import "@testing-library/jest-dom";

// axios is already mocked above
jest.mock("axios");

describe("WaiverForm Additional Tests", () => {
  beforeEach(() => {
    delete window.location;
    window.location = { href: "" };
    axios.post.mockReset();
  });

  test("disables the submit button while processing", async () => {
    // Force axios.post to return a never-resolving promise to simulate a pending state.
    axios.post.mockImplementation(() => new Promise(() => {}));
  
    render(<WaiverForm />);
    
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2023-12-12" },
    });
    
    const submitButton = screen.getByRole("button", { name: /Sign Waiver/i });
    fireEvent.click(submitButton);

    // The button text should change to "Processing..." and the button should be disabled.
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Processing/i })).toBeDisabled();
    });
  });

  test("prevents multiple submissions while loading", async () => {
    // Simulate axios.post that delays resolution so we can check multiple clicks
    axios.post.mockImplementation(() => new Promise(() => {}));
  
    render(<WaiverForm />);
    
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2023-12-12" },
    });
    
    const submitButton = screen.getByRole("button", { name: /Sign Waiver/i });
    
    // Click the button multiple times
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    
    // Expect axios.post to be called only once despite multiple clicks.
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  });

  test("renders the ToastContainer", () => {
    render(<WaiverForm />);
    // Query the ToastContainer element using its class name
    const toastContainer = document.querySelector('.Toastify');
    expect(toastContainer).toBeInTheDocument();
  });
  
});
