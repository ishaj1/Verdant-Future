import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { useLocation, useNavigate, MemoryRouter } from "react-router-dom";
import axios from "../../api/axios";
import Transaction from "../../pages/Transaction";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock("../../api/axios", () => ({
  post: jest.fn(),
}));

jest.mock("../../hooks/useAuth", () => ({
    __esModule: true,
    default: jest.fn(() => ({ auth: { username: "testuser" } })),
  }));

describe("Transaction Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

//   it("renders correctly", () => {
    // useLocation.mockReturnValue({ state: { total_cost: 100, price: 10, credits: 10, sendToUser: "testuser", isTrade: true } });
//     const { getByText } = render(<Transaction />);
//     expect(getByText("Total Cost: $1")).toBeInTheDocument();
//   });

  it("submits transaction successfully", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        details: "Transaction successful",
      },
    });
    const locationState = {
      price: 1000,
      credits: 10,
      total_cost: 10000,
      sendToUser: "testuser", 
      isTrade: true
    };
    useLocation.mockReturnValue({ state: locationState });

    render(
      <MemoryRouter>
        <Transaction />
      </MemoryRouter>
    );
    fireEvent.submit(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    expect(useNavigate).toHaveBeenCalledTimes(1);
    expect(useNavigate).toHaveBeenCalledWith("/company_transfer", {
      state: { details: "Transaction successful" },
    });
  });

//   it("handles transaction failure", async () => {
//     useLocation.mockReturnValue({ state: { total_cost: 100, price: 10, credits: 10, sendToUser: "testuser", isTrade: true } });
//     axios.post.mockRejectedValueOnce(new Error("Error processing transaction"));
//     useNavigate.mockReturnValue(jest.fn());

//     const { getByText } = render(<Transaction />);
//     fireEvent.click(getByText("Confirm"));

//     await waitFor(() => {
//       expect(axios.post).toHaveBeenCalledTimes(1);
//       expect(screen.getByText("Issue processing request. Please try again later.")).toBeInTheDocument();
//     });
//   });
});
