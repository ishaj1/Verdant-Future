import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import RequireAuth from '../../components/RequireAuth';
import useAuth from '../../hooks/useAuth'; 
import HomePage from '../../pages/Home';

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
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/protected' element={<RequireAuth element={<div>Child Componenet</div>} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Child Component')).not.toBeInTheDocument();
    await waitFor(()=> {
      expect(screen.queryAllByText('Login')[0]).toBeInTheDocument();
    });
  });
});
