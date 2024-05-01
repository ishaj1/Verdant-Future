import React from "react";
import renderer from "react-test-renderer";
import { MemoryRouter, useLocation } from "react-router-dom";
import TransactionResult from "../../pages/TransactionResult";
import useAuth from "../../hooks/useAuth";

jest.mock("../../hooks/useAuth");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

describe("Transaction Result", () => {
  beforeEach(() => {
    useLocation.mockReturnValue({ state: { details: { receipt_url: "example.com" } } });
    useAuth.mockReturnValue({ auth: { username: "testuser" } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("matches the snapshot", () => {
    const component = renderer.create(
      <MemoryRouter>
        <TransactionResult />
      </MemoryRouter>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
