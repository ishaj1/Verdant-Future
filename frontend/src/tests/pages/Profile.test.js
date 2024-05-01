import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Profile from "../../pages/Profile";
import axios from "../../api/axios";

// Mock axios to prevent actual HTTP requests during testing
jest.mock("../../api/axios", () => ({
  get: jest.fn(),
}));

describe("Profile Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile data correctly", async () => {
    const mockProfileData = {
      isProject: true,
      project_name: "Project Name",
      project_username: "project_username",
      project_details: "Project Details",
      funds_received: 1000,
      funds_required: 5000,
      contact_name: "John Doe",
      contact_detail: "john@example.com",
    };

    axios.get.mockResolvedValueOnce({ data: { records: mockProfileData } });

    render(<Router>
        <Profile />
        </Router>);

    expect(await screen.findByText("Project Name")).toBeVisible()
    expect(screen.getByText(/Project Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Funds Received: 1000/i)).toBeInTheDocument();
    expect(screen.getByText(/Funding Goal: 5000/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact Name: John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact Details: john@example.com/i)).toBeInTheDocument();
  });

//   it("displays 'Update Profile' link when user is authenticated and viewing own profile", async () => {
//     const mockAuth = {
//       isProject: true,
//       username: "project_username",
//     };

//     const mockProfileData = {
//       isProject: true,
//       project_name: "Project Name",
//       project_username: "project_username",
//     };

//     axios.get.mockResolvedValueOnce({ data: { records: mockProfileData } });

//     render(<Router>
//         <Profile />
//         </Router>);

//     expect(await screen.findByText(/Update Profile/i)).toBeInTheDocument();
//   });

//   it("displays 'Invest' button when user is authenticated and viewing company profile", async () => {
//     const mockAuth = {
//       isProject: false,
//       username: "company_username",
//     };

//     // Mock profile data for company
//     const mockProfileData = {
//       isProject: false,
//       company_name: "Company Name",
//       company_username: "company_username",
//     };

//     axios.get.mockResolvedValueOnce({ data: { records: mockProfileData } });

//     render(<Router>
//         <Profile />
//         </Router>);

//     // Assert that 'Invest' button is displayed
//     expect(await screen.findByText(/Invest/i)).toBeInTheDocument();
//   });

//   it("shows 'Update Password' form when user clicks 'Update Password' button", async () => {
//     // Mock authenticated user
//     const mockAuth = {
//       isProject: true,
//       username: "project_username",
//     };

//     // Mock profile data for authenticated user
//     const mockProfileData = {
//       isProject: true,
//       project_name: "Project Name",
//       project_username: "project_username",
//     };

//     axios.get.mockResolvedValueOnce({ data: { records: mockProfileData } });

//     render(<Router>
//         <Profile />
//         </Router>);

//     // Click 'Update Password' button
//     fireEvent.click(await screen.findByText(/Update Password/i));

//     // Assert that 'Update Password' form is displayed
//     expect(await screen.findByText(/Current Password:/i)).toBeInTheDocument();
//     expect(screen.getByText(/New Password:/i)).toBeInTheDocument();
//     expect(screen.getByText(/Confirm New Password:/i)).toBeInTheDocument();
//     expect(screen.getByText(/Update Password/i)).toBeInTheDocument();
//   });

  // Add more test cases for other user authentication scenarios and interactions
});
