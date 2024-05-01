import React from "react";
import renderer from "react-test-renderer";
import OrganizationsDirectory from "../../pages/OrganizationsDirectory";

// Mock axios to prevent actual HTTP requests during testing
jest.mock("../../api/axios", () => ({
  get: jest.fn(),
}));

// Mock Header component
jest.mock("../../components/Header", () => () => <div>Mock Header</div>);

describe("Organizations Directory Component", () => {
  it("matches the snapshot", () => {
    // Mock data for projects and companies
    const projectsData = [
      { project_name: "Project 1", project_details: "Details 1", project_username: "project1" },
      { project_name: "Project 2", project_details: "Details 2", project_username: "project2" },
    ];

    const companiesData = [
      { company_name: "Company 1", company_details: "Details 1", company_username: "company1" },
      { company_name: "Company 2", company_details: "Details 2", company_username: "company2" },
    ];

    // Render the component tree
    const tree = renderer.create(<OrganizationsDirectory />).toJSON();

    // Update component state with mock data
    tree.props.projectsData = projectsData;
    tree.props.companiesData = companiesData;

    // Expect the rendered component tree to match the snapshot
    expect(tree).toMatchSnapshot();
  });
});
