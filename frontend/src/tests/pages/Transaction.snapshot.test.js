import React from "react";
import renderer from "react-test-renderer";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import Transaction from "../../pages/Transaction";

jest.mock("../../api/axios"); 
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(), 
}));

describe("Transaction", () => {
  beforeEach(() => {
    useLocation.mockReturnValue({
      state: {
        total_cost: 100,
        price: 10,
        credits: 10,
        sendToUser: "testuser1",
        isTrade: true,
      },
    });
  });

  it("matches the Transaction snapshot", () => {
    const mockedNavigate = jest.fn();
    useNavigate.mockReturnValue(mockedNavigate);

    const component = renderer.create(
      <MemoryRouter>
        <Transaction />
      </MemoryRouter>
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
