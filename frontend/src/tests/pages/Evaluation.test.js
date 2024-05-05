import React from "react";
import { render, screen } from "@testing-library/react";
import Evaluation from "../../pages/Evaluation";

jest.mock("../../components/Header", () => () => <div data-testid="header">Header</div>);
jest.mock("../../components/CompanyEvaluationForm", () => () => <div data-testid="company-evaluation-form">Company Evaluation Form</div>);

describe("Evaluation Page", () => {
  it("renders Header", () => {
    render(<Evaluation />);
    const headerElement = screen.getByTestId("header");
    expect(headerElement).toBeInTheDocument();
  });

  it("renders 'Company Evaluation Form' heading", () => {
    render(<Evaluation />);
    const headingElement = screen.getByText("Company Evaluation Form");
    expect(headingElement).toBeInTheDocument();
  });

  it("renders CompanyEvaluationForm", () => {
    render(<Evaluation />);
    const formElement = screen.getByTestId("company-evaluation-form");
    expect(formElement).toBeInTheDocument();
  });
});
