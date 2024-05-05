import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import RequireAuth from '../../components/RequireAuth';

jest.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(() => ({ auth: { username: 'testUser' } })),
}));

describe('RequireAuth component', () => {
  it('matches the snapshot when user is authorized', () => {
    const tree = renderer.create(
      <MemoryRouter>
        <RequireAuth>
          <div>Authorized Content</div>
        </RequireAuth>
      </MemoryRouter>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('matches the snapshot when user is not authorized', () => {
    // Mock the useAuth hook to return null, indicating user is not authorized
    jest.spyOn(require('../../hooks/useAuth'), 'default').mockReturnValueOnce({ auth: null });

    const tree = renderer.create(
      <MemoryRouter>
        <RequireAuth>
          <div>Unauthorized Content</div>
        </RequireAuth>
      </MemoryRouter>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
