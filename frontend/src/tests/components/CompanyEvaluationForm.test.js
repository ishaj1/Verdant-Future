import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "../../api/axios";
import CompanyEvaluationForm from "../../components/CompanyEvaluationForm";

jest.mock("../../api/axios", () => ({
  post: jest.fn(),
}));

describe("CompanyEvaluationForm Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("submits evaluation successfully", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        evaluate: true,
      },
    });

    const { getByLabelText, getByText } = render(<Router> <CompanyEvaluationForm /> </Router>);

    fireEvent.change(getByLabelText("Number of Employees:"), { target: { value: "100" } });
    fireEvent.change(getByLabelText("Revenue (USD):"), { target: { value: "1000000" } });
    fireEvent.change(getByLabelText("Emission (metric ton):"), { target: { value: "50" } });
    fireEvent.change(getByLabelText("Electricity (kWh):"), { target: { value: "50000" } });
    fireEvent.change(getByLabelText("Natural Gas (cf):"), { target: { value: "20000" } });
    fireEvent.change(getByLabelText("Water (cubic meter):"), { target: { value: "10000" } });
    fireEvent.change(getByLabelText("Total waste (kg):"), { target: { value: "5000" } });
    fireEvent.change(getByLabelText("Recycled waste (kg):"), { target: { value: "2000" } });

    fireEvent.click(getByText("Submit"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/get_evaluated", {
        username: expect.any(String),
        company_size: "100",
        revenue: "1000000",
        date: expect.any(String),
        emission: "50",
        electricity: "50000",
        natural_gas: "20000",
        water: "10000",
        waste: "5000",
        recycled: "2000",
      });
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
});
