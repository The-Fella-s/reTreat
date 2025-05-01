import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import WaiverForm from '../../pages/waiver';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');

const renderWaiverForm = (slug) =>
  render(
    <AuthContext.Provider value={{ user: { id: 'test-user' } }}>
      <MemoryRouter initialEntries={[`/waiver/${slug}`]}>
        <Routes>
          <Route path="/waiver/:slug" element={<WaiverForm />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe('Brow & Lash Waiver Form', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { href: '' };
    axios.post.mockReset();
  });

  test('disables the submit button while processing', async () => {
    axios.post.mockImplementation(() => new Promise(() => {}));
    renderWaiverForm('brow-lash-waiver');
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'User' },
    });
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: '2023-12-12' },
    });
    const submitButton = screen.getByRole('button', { name: /Sign Waiver/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Processing/i })).toBeDisabled();
    });
  });

  test('prevents multiple submissions while loading', async () => {
    axios.post.mockImplementation(() => new Promise(() => {}));
    renderWaiverForm('brow-lash-waiver');
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'User' },
    });
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: '2023-12-12' },
    });
    const submitButton = screen.getByRole('button', { name: /Sign Waiver/i });
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledTimes(1)
    );
  });

  test('renders the ToastContainer', () => {
    renderWaiverForm('brow-lash-waiver');
    const toastContainer = document.querySelector('.Toastify');
    expect(toastContainer).toBeInTheDocument();
  });
});
