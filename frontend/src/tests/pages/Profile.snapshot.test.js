import React from "react";
import renderer from "react-test-renderer";
import Profile from "../../pages/Profile";
import { BrowserRouter as Router } from "react-router-dom";

// Mock BrowserRouter to prevent errors related to routing
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn().mockReturnValue({ pathname: "/profile" }),
  useParams: jest.fn().mockReturnValue({ id: "123" }),
}));

describe("Profile Page", () => {
  it("matches the snapshot", () => {
    const tree = renderer.create(<Router>
      <Profile />
      </Router>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
