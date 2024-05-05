import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "../../api/axios";
import CompanyEvaluationForm from "../../components/CompanyEvaluationForm";

jest.mock("../../api/axios", () => ({
  post: jest.fn(),
}));
jest.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: () => ({
    auth: {
      username: 'testUser',
    },
  }),
}));

describe("CompanyEvaluationForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", async () => {
    render(<Router> <CompanyEvaluationForm /> </Router>);

  });

  it("form data changed successfully", async () => {
    const { getByLabelText } = render(<Router> <CompanyEvaluationForm /> </Router>);

    fireEvent.change(getByLabelText("Number of Employees:"), { target: { value: "100" } });
    fireEvent.change(getByLabelText("Revenue (USD):"), { target: { value: "1000000" } });
    fireEvent.change(getByLabelText("Emission (metric ton):"), { target: { value: "50" } });
    fireEvent.change(getByLabelText("Electricity (kWh):"), { target: { value: "50000" } });
    fireEvent.change(getByLabelText("Natural Gas (cf):"), { target: { value: "20000" } });
    fireEvent.change(getByLabelText("Water (cubic meter):"), { target: { value: "10000" } });
    fireEvent.change(getByLabelText("Total waste (kg):"), { target: { value: "5000" } });
    fireEvent.change(getByLabelText("Recycled waste (kg):"), { target: { value: "2000" } });


    await waitFor(() => {
      expect(getByLabelText("Number of Employees:").value).toBe("100");
      expect(getByLabelText("Revenue (USD):").value).toBe("1000000");
      expect(getByLabelText("Emission (metric ton):").value).toBe("50");
      expect(getByLabelText("Electricity (kWh):").value).toBe("50000");
      expect(getByLabelText("Natural Gas (cf):").value).toBe("20000");
      expect(getByLabelText("Water (cubic meter):").value).toBe("10000");
      expect(getByLabelText("Total waste (kg):").value).toBe("5000");
      expect(getByLabelText("Recycled waste (kg):").value).toBe("2000");
    });
  });

  it("submits evaluation successfully", async () => {
    axios.post.mockResolvedValueOnce({ data: { evaluate: true } });
    const header = {"headers": { "Content-Type": "application/x-www-form-urlencoded" }}
    const { getByLabelText, getByText, getByRole } = render(<Router> <CompanyEvaluationForm /> </Router>);

    fireEvent.change(getByLabelText("Number of Employees:"), { target: { value: "100" } });
    fireEvent.change(getByLabelText("Revenue (USD):"), { target: { value: "1000000" } });
    fireEvent.change(getByLabelText("Emission (metric ton):"), { target: { value: "50" } });
    fireEvent.change(getByLabelText("Electricity (kWh):"), { target: { value: "50000" } });
    fireEvent.change(getByLabelText("Natural Gas (cf):"), { target: { value: "20000" } });
    fireEvent.change(getByLabelText("Water (cubic meter):"), { target: { value: "10000" } });
    fireEvent.change(getByLabelText("Total waste (kg):"), { target: { value: "5000" } });
    fireEvent.change(getByLabelText("Recycled waste (kg):"), { target: { value: "2000" } });

    fireEvent.submit(getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
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
      }, header);
    });
  });

  it("displays error message on failed evaluation returned", async () => {
    axios.post.mockResolvedValueOnce({ data: { evaluate: false } });
    const { getByLabelText, getByText, queryByText, getByRole } = render(<Router> <CompanyEvaluationForm /> </Router>);
   
    fireEvent.change(getByLabelText("Number of Employees:"), { target: { value: "100" } });
    fireEvent.change(getByLabelText("Revenue (USD):"), { target: { value: "1000000" } });
    fireEvent.change(getByLabelText("Emission (metric ton):"), { target: { value: "50" } });
    fireEvent.change(getByLabelText("Electricity (kWh):"), { target: { value: "50000" } });
    fireEvent.change(getByLabelText("Natural Gas (cf):"), { target: { value: "20000" } });
    fireEvent.change(getByLabelText("Water (cubic meter):"), { target: { value: "10000" } });
    fireEvent.change(getByLabelText("Total waste (kg):"), { target: { value: "5000" } });
    fireEvent.change(getByLabelText("Recycled waste (kg):"), { target: { value: "2000" } });

    fireEvent.submit(getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(queryByText("Evaluation Successful")).toBeNull();
      expect(getByText("Error with evaluation process")).toBeInTheDocument();
      expect(queryByText("Error submitting evaluation. Please try again.")).toBeNull();
    });
  });

  it("displays error message on evaluation process problem", async () => {
    axios.post.mockRejectedValueOnce(new Error("Evaluation failed"));
    const { getByLabelText, getByText, queryByText, getByRole } = render(<Router> <CompanyEvaluationForm /> </Router>);
   
    fireEvent.change(getByLabelText("Number of Employees:"), { target: { value: "100" } });
    fireEvent.change(getByLabelText("Revenue (USD):"), { target: { value: "1000000" } });
    fireEvent.change(getByLabelText("Emission (metric ton):"), { target: { value: "50" } });
    fireEvent.change(getByLabelText("Electricity (kWh):"), { target: { value: "50000" } });
    fireEvent.change(getByLabelText("Natural Gas (cf):"), { target: { value: "20000" } });
    fireEvent.change(getByLabelText("Water (cubic meter):"), { target: { value: "10000" } });
    fireEvent.change(getByLabelText("Total waste (kg):"), { target: { value: "5000" } });
    fireEvent.change(getByLabelText("Recycled waste (kg):"), { target: { value: "2000" } });

    fireEvent.submit(getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(queryByText("Evaluation Successful")).toBeNull();
      expect(queryByText("Error with evaluation process")).toBeNull();
      expect(getByText("Error submitting evaluation. Please try again.")).toBeInTheDocument();
    });
  });
});
