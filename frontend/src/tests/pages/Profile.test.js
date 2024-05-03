import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "../../pages/Profile";
import axios from "../../api/axios";
import AuthContext from "../../context/AuthProvider";

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

describe("Viewing project's profile page when logged in as a company", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    const mockProfileData = {
      project_name: "Project Name",
      project_username: "project_username",
      project_details: "Project Details",
      funds_received: 1000,
      funds_required: 5000,
      contact_name: "John Doe",
      contact_detail: "john@example.com",
    };

    axios.get.mockResolvedValueOnce({ data: { records: mockProfileData } });
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: [] });

  });

  it("renders profile data correctly", async () => {
    render(<MemoryRouter initialEntries={["/project/project_username"]}> <Profile /> </MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(/Project Name/)).toBeInTheDocument();
      expect(screen.getByText(/Project Details/)).toBeInTheDocument();
      expect(screen.getByText(/Funds Received: 1000/)).toBeInTheDocument();
      expect(screen.getByText(/Funding Goal: 5000/)).toBeInTheDocument();
      expect(screen.getByText(/Contact Name: John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/Contact Details: john@example.com/)).toBeInTheDocument();
    });
  });

  it("displays 'Invest' button when user is authenticated and viewing project profile", async () => {
    render(<MemoryRouter initialEntries={["/project/project_username"]}> <Profile /> </MemoryRouter>);

    expect(await screen.findByText("Invest")).toBeInTheDocument();
  });
});

describe("Viewing own profile when logged in", () => {
  beforeEach(()=> {
    jest.clearAllMocks();

    const mockProfileData = {
      project_name: "Project Name",
      project_username: "testUser",
      project_details: "Project Details",
      funds_received: 1000,
      funds_required: 5000,
      contact_name: "John Doe",
      contact_detail: "john@example.com",
    };
    axios.get.mockResolvedValueOnce({ data: { records: mockProfileData } });
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: [] });

  })

  it("displays 'Update Profile' link when user is authenticated and viewing own profile", async () => {
    render(<MemoryRouter initialEntries={["/profile/testUser"]}>
      <AuthContext.Provider value={{ auth: {username: 'testUser', isProject: true} }}> <Profile /> </AuthContext.Provider>
      </MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(/Update Profile/)).toBeInTheDocument();
    });

  });

  it("shows 'Update Password' form when user clicks 'Update Password' button", async () => {
    render(<MemoryRouter initialEntries={["/profile/testUser"]}>
    <AuthContext.Provider value={{ auth: {username: 'testUser', isProject: true} }}> <Profile /> </AuthContext.Provider>
    </MemoryRouter>);
  
    await waitFor( () => {
      expect(screen.getByText('Update Password')).toBeInTheDocument();
    });
    const password_button = screen.getByText('Update Password');
    fireEvent.click(password_button);
  
    await waitFor( () => {
      expect(screen.getByText("Current Password")).toBeInTheDocument();
      expect(screen.getByText("New Password")).toBeInTheDocument();
      expect(screen.getByText("Confirm New Password")).toBeInTheDocument();
      expect(screen.getByText("Update Password")).toBeInTheDocument();
    });
  });

});  

  // Add more test cases for other user authentication scenarios and interactions
// });
