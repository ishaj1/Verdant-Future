import React from 'react';
import { render, fireEvent, screen } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import InitiateTransactionForm from "../../components/InitiateTransactionForm";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("InitiateTransactionForm", () => {
  it("updates credits and total cost correctly", () => {
    render(<InitiateTransactionForm isTrade={true} uid="123" />);

    const creditsInput = screen.getByLabelText("Credits");
    fireEvent.change(creditsInput, { target: { value: 5 } });

    expect(creditsInput.value).toBe("5");
    expect(screen.getByText("Total Cost: $5000")).toBeInTheDocument();
  });

  it("submits transaction successfully", () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(<InitiateTransactionForm isTrade={false} uid="456" />);

    const creditsInput = screen.getByLabelText("Credits");
    fireEvent.change(creditsInput, { target: { value: 10 } });

    const continueButton = screen.getByRole("button", { name: "Continue" });
    fireEvent.click(continueButton);

    expect(mockNavigate).toHaveBeenCalledWith("/transaction", {
      state: {
        sendToUser: "456",
        price: 100000,
        total_cost: 1000000,
        credits: "10",
        isTrade: false,
      },
    });
  });
});
