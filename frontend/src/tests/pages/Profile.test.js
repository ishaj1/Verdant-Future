import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "../../pages/Profile";
import axios from "../../api/axios";
import AuthContext from "../../context/AuthProvider";

jest.mock("../../icons/leaves.png", () => ({}));
jest.mock("../../icons/green_credits.png", () => ({}));
jest.mock("../../icons/search.png", () => ({}));
jest.mock("../../icons/gear.png", () => ({}));
jest.mock("../../icons/trade.png", () => ({}));
jest.mock("../../icons/password.png", () => ({}));
jest.mock("../../icons/history.png", () => ({}));


jest.mock("../../api/axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
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

describe("Profile Page", () => {
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
    axios.get.mockResolvedValueOnce({ data: { records: []}});
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({ account_update_link: "https://example.com"});
  })
  
  it("renders profile correctly", async () => {
    render(<MemoryRouter initialEntries={["/profile/testUser"]}>
    <AuthContext.Provider value={{ auth: {username: 'testUser', isProject: true} }}> <Profile /> </AuthContext.Provider>
    </MemoryRouter>);
  
    await waitFor( () => {
      expect(screen.getByText('Welcome,')).toBeInTheDocument();
      expect(screen.getByText('Green credits:')).toBeInTheDocument();
      expect(screen.getByText('Get Evaluated')).toBeInTheDocument();
      expect(screen.getByText('Fundraising')).toBeInTheDocument();
      expect(screen.getByText('Pending Trade Requests')).toBeInTheDocument();
      expect(screen.getByText('Transaction History')).toBeInTheDocument();
      expect(screen.getByText('Browse Companies')).toBeInTheDocument();
      expect(screen.getByText('Browse Projects')).toBeInTheDocument();
      expect(screen.getByText('Update Your Profile')).toBeInTheDocument();
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
