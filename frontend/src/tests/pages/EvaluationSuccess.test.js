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

jest.mock("../../icons/green_credits.png", () => ({}));

describe("EvaluationSuccess Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<Router>
        <EvaluationSuccess />
    </Router>);
  });

  it("fetches green credit data and displays it", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        credits: {
          green_credit: 10,
          total_credit: 20,
        },
        target_ratios: {},
        comp_ratios: {},
        ratings: {},
      },
    });

    const { getByText } = render(<Router>
        <EvaluationSuccess />
    </Router>);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/get_green_credit", { params: { username: "testUser" } });
      expect(getByText("Evaluation Successful!")).toBeInTheDocument();
      expect(getByText("Thank you for completing your evaluation.")).toBeInTheDocument();
      expect(getByText("Emission Intensity (metric tons / capita)")).toBeInTheDocument();
      expect(getByText("Energy Intensity (MJ / USD)")).toBeInTheDocument();
      expect(getByText("Water Efficiency (USD / cubic meter)")).toBeInTheDocument();
      expect(getByText("Waste Ratio (percent recycled)")).toBeInTheDocument();
      expect(getByText(`Your Company's Calculated Green Credit for this evaluation is:`)).toBeInTheDocument();
      expect(getByText(`Your Company's Total Green Credit is updated to:`)).toBeInTheDocument();
      expect(getByText("GO BACK")).toBeInTheDocument();
    });
  });

  it("displays error message when API request fails", async () => {
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
