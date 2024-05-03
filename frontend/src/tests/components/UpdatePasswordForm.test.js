import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from '../../api/axios'; 
import UpdatePasswordForm from '../../components/UpdatePasswordForm';

jest.mock('../../api/axios', () => ({
    post: jest.fn(),
  }));
jest.mock('../../hooks/useAuth', () => ({
    __esModule: true,
    default: () => ({
      auth: {
        username: 'testUser',
        isProject: false, 
      },
    }),
}));

describe('UpdatePasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits update password form with valid data', async () => {
    axios.post.mockResolvedValueOnce({ data: { changePassword: true } });
    const header = {"headers": { "Content-Type": "application/x-www-form-urlencoded" }}

    const { getByLabelText, getByText } = render(<UpdatePasswordForm setReturnMessage={() => {}} setShowForm={() => {}} />);
    await waitFor(() => {
        expect(getByText('Current Password')).toBeInTheDocument();
        expect(getByText('New Password')).toBeInTheDocument();
        expect(getByText('Confirm New Password')).toBeInTheDocument();
        expect(getByText('Change Password')).toBeInTheDocument();
    });

    fireEvent.change(getByLabelText('Current Password'), { target: { value: 'oldpassword' } });
    fireEvent.change(getByLabelText('New Password'), { target: { value: 'newpassword' } });
    fireEvent.change(getByLabelText('Confirm New Password'), { target: { value: 'newpassword' } });

    fireEvent.submit(getByText('Change Password'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('/update_password', {
        isProject: false, 
        username: "testUser", 
        old_password: 'oldpassword',
        new_password: 'newpassword',
      }, header);
    });
  });

  it('sets return message correctly when password is updated', async () => {
    axios.post.mockResolvedValueOnce({ data: { changePassword: true } });
    const setReturnMessageMock = jest.fn();
    const setShowFormMock = jest.fn();
    const { getByLabelText, getByText } = render(<UpdatePasswordForm setReturnMessage={setReturnMessageMock} setShowForm={setShowFormMock} />);
    
    fireEvent.change(getByLabelText('Current Password'), { target: { value: 'oldpassword' } });
    fireEvent.change(getByLabelText('New Password'), { target: { value: 'newpassword' } });
    fireEvent.change(getByLabelText('Confirm New Password'), { target: { value: 'newpassword' } });

    fireEvent.submit(getByText('Change Password'));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(setReturnMessageMock).toHaveBeenCalledWith('Password Updated');
      expect(setShowFormMock).toHaveBeenCalledWith(false);
    });
  });

  it('displays error message if new passwords do not match', async () => {
    const { getByLabelText, getByText } = render(<UpdatePasswordForm setReturnMessage={() => {}} setShowForm={() => {}} />);

    fireEvent.change(getByLabelText('Current Password'), { target: { value: 'oldpassword' } });
    fireEvent.change(getByLabelText('New Password'), { target: { value: 'newpassword' } });
    fireEvent.change(getByLabelText('Confirm New Password'), { target: { value: 'differentpassword' } });

    fireEvent.submit(getByText('Change Password'));

    expect(getByText('New passwords do not match.')).toBeInTheDocument();
  });

  it('informs user if the request to change their password was unsuccessful', async () => {
    axios.post.mockResolvedValueOnce({ data: { changePassword: false } });
    const { getByLabelText, getByText } = render(<UpdatePasswordForm setReturnMessage={() => {}} setShowForm={() => {}} />);

    fireEvent.change(getByLabelText("Current Password"), { target: { value: "incorrectpasswd"} });
    fireEvent.change(getByLabelText("New Password"), { target: { value: "newpasswd"} });
    fireEvent.change(getByLabelText("Confirm New Password"), { target: { value: "newpasswd" }});

    fireEvent.submit(getByText("Change Password"));

    await waitFor( () => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    })
    expect(axios.post).toHaveBeenCalledWith('/update_password', {
      isProject: false,
      username: "testUser",
      old_password: "incorrectpasswd",
      new_password: "newpasswd",
    },
    {
      headers: {"Content-Type": "application/x-www-form-urlencoded" },
    });

    expect(getByText("Could not update password. Please check if the current password is correctly entered.")).toBeInTheDocument();
  })
});
