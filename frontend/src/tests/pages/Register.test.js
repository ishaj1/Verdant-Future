import React from "react";
import { render, screen } from "@testing-library/react";
import Register from "../../pages/Register";

jest.mock("../../components/RegisterForm", () => () => <div data-testid="register-form">Registration Form</div>);

describe("Register Page", () => {
  it("renders RegisterForm", () => {
    render(<Register />);
    const registerForm = screen.getByTestId("register-form");
    expect(registerForm).toBeInTheDocument();
  });
});
