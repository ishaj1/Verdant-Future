import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import TransactionResult from "../../pages/TransactionResult";
import useAuth from "../../hooks/useAuth";

jest.mock("../../hooks/useAuth");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

describe("TransactionResult Component", () => {
  beforeEach(() => {
    useLocation.mockReturnValue({ state: { details: { receipt_url: "example.com" } } });
    useAuth.mockReturnValue({ auth: { username: "testuser" } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without errors", () => {
    render(
      <MemoryRouter>
        <TransactionResult />
      </MemoryRouter>
    );
    expect(screen.getByText("Payment Successful")).toBeInTheDocument();
  });

  it("renders receipt link correctly", () => {
    render(
      <MemoryRouter>
        <TransactionResult />
      </MemoryRouter>
    );
    const receiptLink = screen.getByText("Receipt");
    expect(receiptLink).toBeInTheDocument();
    expect(receiptLink).toHaveAttribute("href", "example.com");
    expect(receiptLink).toHaveAttribute("target", "_blank");
    expect(receiptLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders Return to Profile link correctly", () => {
    render(
      <MemoryRouter>
        <TransactionResult />
      </MemoryRouter>
    );
    const returnToProfileLink = screen.getByText("Return to Profile");
    expect(returnToProfileLink).toBeInTheDocument();
    expect(returnToProfileLink).toHaveAttribute("href", "/profile/testuser");
  });
});
