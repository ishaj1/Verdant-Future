import React from "react";
import renderer from "react-test-renderer";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "../../pages/Home";

jest.mock("../../icons/home.png", () => ({}));

describe("Home Page", () => {
  it("matches snapshot", () => {
    const tree = renderer.create(<Router><Home /></Router>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
