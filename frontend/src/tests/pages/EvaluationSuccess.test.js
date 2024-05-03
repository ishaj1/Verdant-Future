import React from "react";
import { render, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "../../api/axios"; 
import EvaluationSuccess from "../../pages/EvaluationSuccess"; 

jest.mock("../../api/axios", () => ({
  get: jest.fn(),
}));

jest.mock("../../hooks/useAuth", () => ({
  __esModule: true,
  default: () => ({ auth: { username: "testUser" } }),
}));

describe("EvaluationSuccess Page", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it("renders without crashing", () => {
    render(<Router>
        <EvaluationSuccess />
    </Router>);
  });

  it("fetches green credit data and displays it", async () => {
    const greenCreditData = {
      green_credit: 100,
      total_credit: 200,
    };

    // Mock axios get function to return a promise that resolves with greenCreditData
    axios.get.mockResolvedValueOnce({ data: { credits: greenCreditData } });

    const { getByText } = render(<Router>
        <EvaluationSuccess />
    </Router>);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/get_green_credit", { params: { username: "testUser" } });
      expect(getByText(`Your Company's Calculated Green Credit for this evaluation is: ${greenCreditData.green_credit}`)).toBeInTheDocument();
      expect(getByText(`Your Company's Total Green Credit is updated to: ${greenCreditData.total_credit}`)).toBeInTheDocument();
    });
  });

  it("displays error message when API request fails", async () => {
    // Mock axios get function to return a rejected promise
    axios.get.mockRejectedValueOnce(new Error("API Error"));

    const { getByText } = render(<Router>
        <EvaluationSuccess />
    </Router>);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/get_green_credit", { params: { username: "testUser" } });
      expect(getByText("Error fetching green credit. Please try again.")).toBeInTheDocument();
    });
  });

  it("displays 'User Not Found' error message when no company is found", async () => {
    // Mock axios get function to return a response indicating no company found
    axios.get.mockResolvedValueOnce({ data: { message: "No company found!" } });

    const { getByText } = render(<Router>
        <EvaluationSuccess />
    </Router>);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/get_green_credit", { params: { username: "testUser" } });
      expect(getByText("User Not Found")).toBeInTheDocument();
    });
  });
});
