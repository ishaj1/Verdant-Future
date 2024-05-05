import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import TransactionResult from "../../pages/TransactionResult";

jest.mock('../../hooks/useAuth');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));
jest.mock("../../icons/green_credits.png", () => ({}));

describe('TransactionResult component', () => {
  it('matches the snapshot', () => {
    const mockState = {
      details: {
        receipt_url: 'https://example.com/receipt',
      },
    };

    const authMock = { auth: { username: 'testUser' } };
    const locationMock = { state: mockState };

    require('../../hooks/useAuth').default.mockReturnValue(authMock);
    require('react-router-dom').useLocation.mockReturnValue(locationMock);

    const tree = renderer.create(
      <MemoryRouter>
        <TransactionResult />
      </MemoryRouter>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
