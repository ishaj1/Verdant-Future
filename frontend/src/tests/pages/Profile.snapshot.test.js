import React from "react";
import renderer from "react-test-renderer";
import Profile from "../../pages/Profile";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn().mockReturnValue({ pathname: '/profile/' }),
  useParams: jest.fn().mockReturnValue({ id: '123' }),
}));

jest.mock('../../api/axios', () => {
  const mockProfileData = {
    project_name: "Project Name",
    project_username: "project_username",
    project_details: "Project Details",
    funds_received: 1000,
    funds_required: 5000,
    contact_name: "John Doe",
    contact_detail: "john@example.com",
  };

  return {
    get: jest.fn(() => Promise.resolve({ data: { records: mockProfileData } })),
  };
});

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
  it("matches the snapshot", () => {
    const tree = renderer.create(<Router>
      <Profile />
      </Router>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
