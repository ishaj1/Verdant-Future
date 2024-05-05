import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "../../api/axios";
import { BrowserRouter as Router } from "react-router-dom";
import UpdateProfileForm from "../../components/UpdateProfileForm";

jest.mock("../../api/axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock('../../hooks/useAuth', () => ({
    __esModule: true,
    default: () => ({
      auth: {
        username: 'testUser',
        isProject: true, 
      },
    }),
}));

describe("UpdateProfileForm", () => {
  beforeEach(() => {
    const mockResponseData = {
        records: {
          name: 'Test Org',
          project_association: 'Test Project',
          contact_name: 'John Doe',
          contact_email: 'john@example.com',
          details: 'Description',
          funds_required: '0',
          username: 'testuser', 
        }
      };
  
    axios.get.mockResolvedValueOnce({ data: mockResponseData });
  });

  test("renders form correctly", () => {
    const { getByLabelText, getByText } = render(<Router><UpdateProfileForm /></Router>);
    
    expect(getByLabelText("Project Name")).toBeInTheDocument();
    expect(getByLabelText("Project Association")).toBeInTheDocument();
    expect(getByLabelText("Contact Name")).toBeInTheDocument();
    expect(getByLabelText("Contact Email")).toBeInTheDocument();
    expect(getByLabelText("Description of Your Organization")).toBeInTheDocument();
    expect(getByLabelText("Fund Goal (0 if you are not looking for funds)")).toBeInTheDocument();
    expect(getByText("Update")).toBeInTheDocument();
  });

  test("updates profile successfully", async () => {
    axios.post.mockResolvedValueOnce({ data: { update: true } });
    const { getByLabelText, getByText } =  render(<Router><UpdateProfileForm /></Router>);

    fireEvent.change(getByLabelText("Project Name"), { target: { value: "New Project Name" } });
    fireEvent.change(getByLabelText("Project Association"), { target: { value: "New Association" } });
    fireEvent.change(getByLabelText("Contact Name"), { target: { value: "New Contact Name" } });
    fireEvent.change(getByLabelText("Contact Email"), { target: { value: "newemail@example.com" } });
    fireEvent.change(getByLabelText("Description of Your Organization"), { target: { value: "New Description" } });
    fireEvent.change(getByLabelText("Fund Goal (0 if you are not looking for funds)"), { target: { value: "1000" } });

    fireEvent.submit(getByText("Update"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith("/update_profile", {
        name: "New Project Name",
        isProject: true,
        association: "New Association",
        username: "testUser",
        contact_name: "New Contact Name",
        contact_email: "newemail@example.com",
        details: "New Description",
        funds_required: "1000",
        funds_received: undefined,
        payment_id: undefined,
      }, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
    });
  });

  test("handles update profile failure", async () => {
    const { getByLabelText, getByText } = render(<Router><UpdateProfileForm /></Router>);
    axios.post.mockResolvedValueOnce({ data: { update: false } });

    fireEvent.change(getByLabelText("Project Name"), { target: { value: "New Project Name" } });
    fireEvent.submit(getByText("Update"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(getByText("Could not update profile. Please check information submitted.")).toBeInTheDocument();
    });
  });

  test("handles update profile processing failure", async () => {
    const { getByLabelText, getByText } = render(<Router><UpdateProfileForm /></Router>);
    axios.post.mockRejectedValueOnce(new Error("Failed to update"));
    fireEvent.change(getByLabelText("Project Name"), { target: { value: "New Project Name" } });
    fireEvent.submit(getByText("Update"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(getByText("Error updating profile. Please try again.")).toBeInTheDocument();
    });
  });
});
