import React from "react";
import renderer from "react-test-renderer";
import Home from "../../pages/Home";

jest.mock("../../components/Header", () => () => <div data-testid="mock-header">Mock Header</div>);
jest.mock("../../components/LoginForm", () => () => <div data-testid="mock-login-form">Mock Login Form</div>);

describe("Home Page", () => {
  it("matches snapshot", () => {
    const tree = renderer
      .create(<Home />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
