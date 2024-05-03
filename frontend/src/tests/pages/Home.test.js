import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Home from "../../pages/Home";

jest.mock("../../components/Header", () => () => <div data-testid="mock-header">Mock Header</div>);
jest.mock("../../components/LoginForm", () => () => <div data-testid="mock-login-form">Mock Login Form</div>);

describe("Home Page", () => {
  it("renders header and initial content", () => {
    render(<Home />);

    const headerElement = screen.getByTestId("mock-header");
    expect(headerElement).toBeInTheDocument();

    const aboutUsLinks = screen.getAllByRole("link", { name: /About us/i });
    aboutUsLinks.forEach(link => {
        expect(link).toBeInTheDocument();
    });

    const projectsLinks = screen.getAllByRole("link", { name:/Projects/i});
    projectsLinks.forEach(link => {
        expect(link).toBeInTheDocument();
    });

    const companiesLinks = screen.getAllByRole("link", { name:/Companies/i});
    companiesLinks.forEach(link => {
        expect(link).toBeInTheDocument();
    });

    const loginButtons = screen.getAllByRole("button", { name:/Login/i});
    loginButtons.forEach(link => {
        expect(link).toBeInTheDocument();
    });

    const signUpLinks = screen.getAllByRole("link", { name:/Sign up/i});
    signUpLinks.forEach(link => {
        expect(link).toBeInTheDocument();
    });
  });

  it("opens login form when login button is clicked", () => {
    render(<Home />);

    fireEvent.click(screen.getAllByRole("button", { name: /Login/i })[0]);

    const loginForm = screen.getByTestId("mock-login-form");
    expect(loginForm).toBeInTheDocument();
  });
});
