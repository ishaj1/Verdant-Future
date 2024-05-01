import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/Header';
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';

jest.mock('../../hooks/useAuth');
jest.mock('../../hooks/useLogout');

describe('Header component', () => {
  test('renders links and button when user is authenticated', () => {
    useAuth.mockReturnValue({ auth: { username: 'testuser' } });
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText('Organizations Directory')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('does not render links and button when user is not authenticated', () => {
    useAuth.mockReturnValue({ auth: null });
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.queryByText('Organizations Directory')).not.toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  test('calls logout function when logout button is clicked', () => {
    useAuth.mockReturnValue({ auth: { username: 'testuser' } });
    const mockLogout = jest.fn();
    useLogout.mockReturnValue(mockLogout);
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

