import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import RegisterForm from "../../components/RegisterForm";

test("RegisterForm matches snapshot", () => {
  const { container } = render(<Router><RegisterForm /></Router>);
  expect(container).toMatchSnapshot();
});
