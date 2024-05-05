import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import RegisterForm from "../../components/RegisterForm";
import axios from "../../api/axios";

jest.mock("../../api/axios", () => ({
  post: jest.fn(),
}));

describe("RegisterForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<Router><RegisterForm /></Router>);
    });

    it("submits registration form successfully", async () => {
        axios.post.mockResolvedValueOnce({ data: { register: true } });
        const header = {"headers": { "Content-Type": "application/x-www-form-urlencoded" }}

        const { getByLabelText, getByText, queryByText } = render(<Router><RegisterForm /></Router>);
        fireEvent.change(getByLabelText("Project Name"), { target: { value: "Test Org" } });
        fireEvent.change(getByLabelText("Project Association"), { target: { value: "Test Project" } });
        fireEvent.change(getByLabelText("Username"), { target: { value: "testuser" } });
        fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } });
        fireEvent.change(getByLabelText("Contact Name"), { target: { value: "John Doe" } });
        fireEvent.change(getByLabelText("Contact Email"), { target: { value: "john@example.com" } });
        fireEvent.change(getByLabelText("Tell us a bit more about your organization"), { target: { value: "Description" } });
        fireEvent.change(getByLabelText("Amount of Funds (USD)(0 if not looking for funds)"), { target: { value: "1000" } });

        fireEvent.submit(getByText("Register"));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith("/registerAuth", {
              name: "Test Org",
              project_association: "Test Project",
              isCompany: false,
              username: "testuser",
              password: "password123",
              contact_name: "John Doe",
              contact_email: "john@example.com",
              details: "Description",
              funds_required: "1000",
              funds_received: 0,
            }, header);
      
            expect(queryByText("Error registering. Check information submitted.")).toBeNull();
            expect(queryByText("Error registering. Please try again.")).toBeNull();
          });
    });

    it("displays error message when invalid input", async () => {
        axios.post.mockResolvedValueOnce({ data: { register: false } });
        const header = {"headers": { "Content-Type": "application/x-www-form-urlencoded" }}

        const { getByLabelText, getByText, queryByText } = render(<Router><RegisterForm /></Router>);
        fireEvent.change(getByLabelText("Project Name"), { target: { value: "Test Org" } });
        fireEvent.change(getByLabelText("Project Association"), { target: { value: "Test Project" } });
        fireEvent.change(getByLabelText("Username"), { target: { value: "testuser" } });
        fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } });
        fireEvent.change(getByLabelText("Contact Name"), { target: { value: "John Doe" } });
        fireEvent.change(getByLabelText("Contact Email"), { target: { value: "john@example.com" } });
        fireEvent.change(getByLabelText("Tell us a bit more about your organization"), { target: { value: "Description" } });
        fireEvent.change(getByLabelText("Amount of Funds (USD)(0 if not looking for funds)"), { target: { value: "1000" } });

        fireEvent.submit(getByText("Register"));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(getByText("Error registering. Check information submitted.")).toBeInTheDocument();     
            expect(queryByText("Error registering. Please try again.")).toBeNull();
          });
    });

    it("displays error message when registration fails", async () => {
        axios.post.mockRejectedValueOnce(new Error("Registration failed"));

        const { getByLabelText, getByText, queryByText } = render(<Router><RegisterForm /></Router>);
        fireEvent.change(getByLabelText("Project Name"), { target: { value: "Test Org" } });
        fireEvent.change(getByLabelText("Project Association"), { target: { value: "Test Project" } });
        fireEvent.change(getByLabelText("Username"), { target: { value: "testuser" } });
        fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } });
        fireEvent.change(getByLabelText("Contact Name"), { target: { value: "John Doe" } });
        fireEvent.change(getByLabelText("Contact Email"), { target: { value: "john@example.com" } });
        fireEvent.change(getByLabelText("Tell us a bit more about your organization"), { target: { value: "Description" } });
        fireEvent.change(getByLabelText("Amount of Funds (USD)(0 if not looking for funds)"), { target: { value: "1000" } });

        fireEvent.click(getByText("Register"));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(getByText("Error registering. Please try again.")).toBeInTheDocument();
            expect(queryByText("Error registering. Check information submitted.")).toBeNull();
        });
    });
});
