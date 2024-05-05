import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import PendingTransactions from '../../pages/PendingTransactions';

jest.mock('../../api/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));
jest.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: () => ({
    auth: {
      username: 'testUser',
      isProject: false,
    },
  }),
}));

describe('Pending Transaction component', () => {
  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PendingTransactions />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});