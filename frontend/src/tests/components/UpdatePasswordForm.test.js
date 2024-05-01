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
  it('submits update password form with valid data', async () => {
    axios.post.mockResolvedValueOnce({ data: { changePassword: true } });

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
      });
      expect(getByText('Password Updated')).toBeInTheDocument();
    });
  });

//   it('displays error message if new passwords do not match', async () => {
//     const { getByLabelText, getByText } = render(<UpdatePasswordForm setReturnMessage={() => {}} setShowForm={() => {}} />);

//     fireEvent.change(getByLabelText('Current Password'), { target: { value: 'oldpassword' } });
//     fireEvent.change(getByLabelText('New Password'), { target: { value: 'newpassword' } });
//     fireEvent.change(getByLabelText('Confirm New Password'), { target: { value: 'differentpassword' } });

//     fireEvent.submit(getByLabelText('Change Password'));

//     expect(getByText('New passwords do not match.')).toBeInTheDocument();
//   });
});
