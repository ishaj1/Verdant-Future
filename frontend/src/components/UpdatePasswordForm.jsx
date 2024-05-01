import { useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

export default function UpdatePasswordForm({ setReturnMessage, setShowForm }) {
  const { auth } = useAuth();

  const [message, setMessage] = useState();

  const updatePassword = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const old_password = form.old_password.value;
    const new_password = form.new_password.value;
    const verify_password = form.verify_password.value;

    if (new_password != verify_password) {
      setMessage("New passwords do not match.");
      return;
    }
    setMessage();

    const updatePasswordData = {
      isProject: auth.isProject,
      username: auth.username,
      old_password,
      new_password,
    };

    axios
      .post("/update_password", updatePasswordData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((response) => {
        console.log(response);
        if (response.data.changePassword == false) {
          setMessage(
            "Could not update password. Please check if the current password is correctly entered."
          );
        } else if (response.data.changePassword == true) {
          setReturnMessage("Password Updated");
          setShowForm(false);
        }
      })
      .catch((error) => {});
  };

  return (
    <form className="UpdatePasswordForm" onSubmit={(e) => updatePassword(e)}>
      {message && (
        <>
          {message} <br />
        </>
      )}
      <label htmlFor="old_password">Current Password</label>
      <input type="password" id="old_password" name="old_password" required />
      <label htmlFor="new_password">New Password</label>
      <input type="password" id="new_password" name="new_password" required />
      <label htmlFor="verify_password">Confirm New Password</label>
      <input type="password" id="verify_password" name="verify_password" required />

      <button type="submit">Change Password</button>
    </form>
  );
}
