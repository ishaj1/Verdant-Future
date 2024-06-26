import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import OrganizationsDirectory from "../../pages/OrganizationsDirectory";
import axios from "../../api/axios";


jest.mock("../../api/axios", () => ({
  get: jest.fn(),
}));

jest.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: () => ({
    auth: {
      username: 'testUser',
      isProject: false,
    },
  }),
}));


describe("OrganizationsDirectory Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the header component correctly", () => {
    const { getByText } = render(<Router><OrganizationsDirectory /></Router>);
    expect(getByText("Verdant Future")).toBeInTheDocument();
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
        { company_name: "Company 1", company_details: "Details 1", company_username: "company1", funds_required: 1 },
        { company_name: "Company 2", company_details: "Details 2", company_username: "company2", funds_required: 2 },
      ],
    });

    render(
      <Router>
        <OrganizationsDirectory show="organizations"/>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/(Project [0-9]|Company [0-9])/)).toHaveLength(4);
    });
  });
});
