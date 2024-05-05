import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "../../pages/Home";

jest.mock("../../icons/home.png", () => ({}));

describe("Home Page", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <Router>
        <Home />
      </Router>
    );
    const headerText = getByText("Building a Verdant Future", { exact: false });
    const signUpLink = getByText("signing up");

    expect(headerText).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
  });

  it("navigates to the /register route when the sign-up link is clicked", () => {
    const { getByText } = render(
      <Router>
        <Home />
      </Router>
    );
    const signUpLink = getByText("signing up");
    fireEvent.click(signUpLink);
    expect(window.location.pathname).toBe("/register");
  });

  it("does not render the login form initially", () => {
    const { queryByTestId } = render(
      <Router>
        <Home />
      </Router>
    );
    expect(queryByTestId("loginform")).not.toBeInTheDocument();
  });

  it("renders header and initial content", () => {
    const { getAllByRole } = render(<Router><Home /></Router>);

    const aboutUsLinks = getAllByRole("link", { name: /About us/i });
    aboutUsLinks.forEach(link => {
        expect(link).toBeInTheDocument();
    });

    const loginButtons = getAllByRole("button", { name:/Login/i});
    loginButtons.forEach(link => {
        expect(link).toBeInTheDocument();
    });

    const signUpLinks = getAllByRole("link", { name:/Sign up/i});
    signUpLinks.forEach(link => {
        expect(link).toBeInTheDocument();
    });
  });

  it("opens login form when login button is clicked", () => {
    const { getByText, getAllByRole } = render(<Router><Home /></Router>);

    fireEvent.click(getAllByRole("button", { name: /Login/i })[0]);
    const loginHeader = getByText("Sign in to your account");
    expect(loginHeader).toBeInTheDocument();
  });
});
