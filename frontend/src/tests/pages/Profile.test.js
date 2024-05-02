import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Profile from "../../pages/Profile";
import axios from "../../api/axios";

jest.mock("../../api/axios", () => ({
  get: jest.fn(),
}));

jest.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: () => ({
    auth: {
      username: 'testUser',
      isProject: true, 
    },
  }),
}));

describe("Profile Page", () => {
  beforeEach(() => {
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
  });

  it("renders profile data correctly", async () => {
    render(<Router> <Profile /> </Router>);

    await waitFor(() => {
      expect(screen.getByText("Project Name")).toBeInTheDocument();
      expect(screen.getByText("Project Details")).toBeInTheDocument();
      expect(screen.getByText("Funds Received: 1000")).toBeInTheDocument();
      expect(screen.getByText("Funding Goal: 5000")).toBeInTheDocument();
      expect(screen.getByText("Contact Name: John Doe")).toBeInTheDocument();
      expect(screen.getByText("Contact Details: john@example.com")).toBeInTheDocument();
    });
  });

  it("displays 'Update Profile' link when user is authenticated and viewing own profile", async () => {
    render(<Router> <Profile /> </Router>);

    await waitFor(() => {
      expect(screen.findByText("Update Profile")).toBeInTheDocument();
    });

  });

  it("displays 'Invest' button when user is authenticated and viewing company profile", async () => {
    render(<Router> <Profile /> </Router>);

    expect(await screen.findByText("Invest")).toBeInTheDocument();
  });

  it("shows 'Update Password' form when user clicks 'Update Password' button", async () => {
    render(<Router> <Profile /> </Router>);

    password_button = screen.getByRole('button', { name: 'Update Password' })
    fireEvent.click(password_button);

    expect(screen.findByText("Current Password")).toBeInTheDocument();
    expect(screen.getByText("New Password")).toBeInTheDocument();
    expect(screen.getByText("Confirm New Password")).toBeInTheDocument();
    expect(screen.getByText("Update Password")).toBeInTheDocument();
  });

  // Add more test cases for other user authentication scenarios and interactions
});
