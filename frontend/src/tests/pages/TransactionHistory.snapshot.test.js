import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import TransactionHistory from '../../pages/TransactionHistory';

jest.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: () => ({
    auth: {
      username: 'testUser',
      isProject: false,
    },
  }),
}));
jest.mock("../../icons/green_credits.png", () => ({}));

describe('TransactionHistory component', () => {
  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <TransactionHistory />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
