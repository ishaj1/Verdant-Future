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
    render(<Router><LoginForm /></Router>);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });

    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
    expect(axios.post).toHaveBeenCalledTimes(1);

    // await waitFor(() => {
    //   expect(screen.queryByText('Incorrect login information')).toBeNull();
    //   expect(screen.queryByText('Error logging in')).toBeNull();
    //   expect(axios.post).toHaveBeenCalledTimes(1);
    //   expect(axios.post).toHaveBeenCalledWith("/organizations");
    // });
  });

//   it('handles login failure', async () => {
//     axios.post.mockRejectedValueOnce();
//     render(<LoginForm />);

//     fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
//     fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });

//     fireEvent.submit(screen.getByTestId('login-form'));

//     await waitFor(() => {
//       expect(screen.getByText('Incorrect login information')).toBeInTheDocument();
//       expect(screen.queryByText('Error logging in')).toBeNull();
//     });
//   });

//   it('handles network error', async () => {
//     axios.post.mockRejectedValueOnce(new Error('Network Error'));
//     render(<LoginForm />);

//     fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
//     fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });

//     fireEvent.submit(screen.getByTestId('login-form'));

//     await waitFor(() => {
//       expect(screen.getByText('Error logging in')).toBeInTheDocument();
//       expect(screen.queryByText('Incorrect login information')).toBeNull();
//     });
//   });
});
