import React from "react";
import renderer from "react-test-renderer";
import OrganizationsDirectory from "../../pages/OrganizationsDirectory";

jest.mock("../../api/axios", () => ({
  get: jest.fn(),
}));

jest.mock("../../components/Header", () => () => <div>Mock Header</div>);

describe("Organizations Directory Component", () => {
  it("matches the snapshot", () => {
    const projectsData = [
      { project_name: "Project 1", project_details: "Details 1", project_username: "project1" },
      { project_name: "Project 2", project_details: "Details 2", project_username: "project2" },
    ];

    const companiesData = [
      { company_name: "Company 1", company_details: "Details 1", company_username: "company1" },
      { company_name: "Company 2", company_details: "Details 2", company_username: "company2" },
    ];

    const tree = renderer
    .create(
      <OrganizationsDirectory 
      projectsData={projectsData}
      companiesData={companiesData}/>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
