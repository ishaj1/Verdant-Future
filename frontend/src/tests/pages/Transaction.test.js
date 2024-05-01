import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Transaction from "../../pages/Transaction";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("../../api/axios", () => ({
  post: jest.fn(),
}));

jest.mock("../../hooks/useAuth", () => ({
    __esModule: true,
    default: jest.fn(() => ({ auth: { username: "testuser" } })),
  }));

describe("Transaction Page", () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

  beforeEach(() => {
    jest.clearAllMocks();
  });

//   it("renders correctly", () => {
    // useLocation.mockReturnValue({ state: { total_cost: 100, price: 10, credits: 10, sendToUser: "testuser", isTrade: true } });
//     const { getByText } = render(<Transaction />);
//     expect(getByText("Total Cost: $1")).toBeInTheDocument();
//   });

  it("submits transaction successfully", async () => {
    useLocation.mockReturnValue({ state: { total_cost: 100, price: 10, credits: 10, sendToUser: "testuser", isTrade: true } });
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        details: "Transaction successful",
      },
    });

    render(<Transaction />);
    fireEvent.click(screen.getByText("Confirm"));

    // Wait for navigation to "/transaction-success"
    expect(useNavigate).toHaveBeenCalledTimes(1);
    expect(useNavigate).toHaveBeenCalledWith("/transaction-success", {
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
