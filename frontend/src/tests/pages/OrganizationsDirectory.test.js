import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import OrganizationsDirectory from "../../pages/OrganizationsDirectory";
import axios from "../../api/axios";


jest.mock("../../api/axios", () => ({
  get: jest.fn(),
}));

jest.mock("../../components/Header", () => () => <div data-testid="mock-header">Mock Header</div>);

describe("OrganizationsDirectory Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders header and organization cards with data", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { project_name: "Project 1", project_details: "Details 1", project_username: "project1" },
        { project_name: "Project 2", project_details: "Details 2", project_username: "project2" },
      ],
    });

    axios.get.mockResolvedValueOnce({
      data: [
        { company_name: "Company 1", company_details: "Details 1", company_username: "company1" },
        { company_name: "Company 2", company_details: "Details 2", company_username: "company2" },
      ],
    });

    render(
      <Router>
        <OrganizationsDirectory />
      </Router>
    );

    const headerElement = screen.getByTestId("mock-header");
    expect(headerElement).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByRole("link")).toHaveLength(4);
    });
  });

it("handles errors during data retrieval", async () => {
    axios.get.mockRejectedValueOnce(new Error("Error retrieving projects"));
    axios.get.mockRejectedValueOnce(new Error("Error retrieving companies"));
  
    render(<Router> <OrganizationsDirectory /> </Router>);
  
    await waitFor(() => {
      expect(screen.getByText(/Error retrieving project data./)).toBeInTheDocument();
      expect(screen.getByText(/Error retrieving company data./)).toBeInTheDocument();
    });
  });
});
