import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet } from 'react-router-dom';
import RequireAuth from '../../components/RequireAuth';
import useAuth from '../../hooks/useAuth'; 

jest.mock('../../hooks/useAuth');

describe('RequireAuth component', () => {
  it('renders children when user is authorized', () => {
    useAuth.mockReturnValue({ auth: { username: 'testUser' } });

    render(
      <MemoryRouter>
        <RequireAuth>
          <div data-testid="child">Child Component</div>
        </RequireAuth>
      </MemoryRouter>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('navigates to login page when user is not authorized', async () => {
    useAuth.mockReturnValue({ auth: null });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <RequireAuth />
        <Outlet />
      </MemoryRouter>
    );

    expect(screen.queryByText('Child Component')).not.toBeInTheDocument();
    expect(screen.queryByText('Login Page')).toBeInTheDocument();
  });
});
