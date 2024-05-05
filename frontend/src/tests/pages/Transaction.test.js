import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { useLocation, MemoryRouter } from "react-router-dom";
import axios from "../../api/axios";
import Transaction from "../../pages/Transaction";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: () => mockedNavigate,
}));

jest.mock("../../api/axios", () => ({
  post: jest.fn(),
}));

jest.mock("../../hooks/useAuth", () => ({
    __esModule: true,
    default: jest.fn(() => ({ auth: { username: "testuser" } })),
  }));

describe("Transaction Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    useLocation.mockReturnValue({ state: { total_cost: 100, price: 10, credits: 10, sendToUser: "testuser", isTrade: true } });
    const { getByText } = render(<MemoryRouter><Transaction /></MemoryRouter>);
    expect(getByText("Transaction Detail")).toBeInTheDocument();
    const strongElement = getByText("Total Cost");
    const parentParagraph = strongElement.parentElement;
    expect(parentParagraph).toHaveTextContent("Total Cost: $1000");
  });

  it("submits an donation in a project", async () => {
    useLocation.mockReturnValue({ state: { total_cost: 100, price: 10, credits: 10, sendToUser: "testproject", isTrade: false } });
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        details: "Transaction successful",
      },
    });

    render(<MemoryRouter><Transaction /></MemoryRouter>);
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(()=> {
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
    });
    expect(mockedNavigate).toHaveBeenCalledWith("/transaction-success", {
      state: { details: "Transaction successful" },
    })
  });

  it("submits a trade offer with a company", async () => {
    useLocation.mockReturnValue({ state: { total_cost: 100, price: 10, credits: 10, sendToUser: "testcompany", isTrade: true } });
    axios.post.mockResolvedValueOnce({
      data: {
        create: true,
        details: "Transaction successful",
      },
    });

    render(<MemoryRouter><Transaction /></MemoryRouter>);
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(()=> {
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
    });
    expect(mockedNavigate).toHaveBeenCalledWith("/profile/testuser", { state: { message: "Trade Request Submitted!" }});
  });

  it("handles transaction failure", async () => {
    useLocation.mockReturnValue({ state: { total_cost: 100, price: 10, credits: 10, sendToUser: "testuser", isTrade: true } });
    axios.post.mockRejectedValueOnce(new Error("Error processing transaction"));

    const { getByText } = render(<MemoryRouter><Transaction /></MemoryRouter>);
    fireEvent.click(getByText("Submit"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Issue processing request. Please try again later.")).toBeInTheDocument();
    });
  });
});