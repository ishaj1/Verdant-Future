import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from "react-router-dom";

import LoginForm from '../../components/LoginForm';
import axios from "../../api/axios";

jest.mock("../../api/axios", () => ({
    post: jest.fn(),
  }));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Router><LoginForm /></Router>);
  });

  it('handles login successfully', async () => {
    axios.post.mockResolvedValueOnce({ data: { user: true } });
    const header = {"headers": { "Content-Type": "application/x-www-form-urlencoded" }}
    render(<Router><LoginForm /></Router>);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });

    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
    expect(axios.post).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByText('Incorrect login information. Please check your username and password, and try again.')).toBeNull();
      expect(screen.queryByText('Error logging in. Please try again.')).toBeNull();
      expect(axios.post).toHaveBeenCalledWith("/login", {"isCompany":false, "username":"testuser", "password":"testpassword"}, header);
    });
  });

  it('handles login failure', async () => {
    axios.post.mockResolvedValueOnce({ data: { user: false } });
    const header = {"headers": { "Content-Type": "application/x-www-form-urlencoded" }}
    render(<Router><LoginForm /></Router>);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });

    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
    expect(axios.post).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByText('Incorrect login information. Please check your username and password, and try again.')).toBeInTheDocument();
      expect(screen.queryByText('Error logging in. Please try again.')).toBeNull();
      expect(axios.post).toHaveBeenCalledWith("/login", {"isCompany":false, "username":"testuser", "password":"testpassword"}, header);
    });
  });

  it('handles network error', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));
    render(<Router><LoginForm /></Router>);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });

    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Error logging in. Please try again.')).toBeInTheDocument();
      expect(screen.queryByText('Incorrect login information. Please check your username and password, and try again.')).toBeNull();
    });
  });
});
