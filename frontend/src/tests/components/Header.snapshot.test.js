import React from 'react';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/LoginForm';

jest.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(() => ({ auth: { username: 'testuser' } })),
}));

jest.mock('../../hooks/useLogout', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Header snapshots', () => {
  it('matches the snapshot when user is authenticated', () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('matches the snapshot when user is not authenticated', () => {
    jest.clearAllMocks();
    jest.mock('../../hooks/useAuth', () => ({
      __esModule: true,
      default: jest.fn(() => ({ auth: null })),
    }));
    const tree = renderer
      .create(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

