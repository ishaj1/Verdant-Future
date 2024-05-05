import React from "react";
import renderer from "react-test-renderer";
import Evaluation from "../../pages/Evaluation";

jest.mock("../../components/Header", () => () => <div data-testid="mock-header">Mock Header</div>);
jest.mock("../../components/CompanyEvaluationForm", () => () => <div data-testid="mock-company-evaluation-form">Mock Company Evaluation Form</div>);

test("Evaluation page matches snapshot", () => {
  const tree = renderer.create(<Evaluation />).toJSON();
  expect(tree).toMatchSnapshot();
});
