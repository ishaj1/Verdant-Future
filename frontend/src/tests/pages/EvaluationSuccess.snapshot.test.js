import React from "react";
import renderer from "react-test-renderer";
import { BrowserRouter as Router } from "react-router-dom";
import EvaluationSuccess from "../../pages/EvaluationSuccess";

jest.mock("../../icons/green_credits.png", () => ({}));

test("EvaluationSuccess page matches snapshot", () => {
  const tree = renderer.create(
    <Router>
      <EvaluationSuccess />
    </Router>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
