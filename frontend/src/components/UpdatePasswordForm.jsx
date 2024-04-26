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
      <div>
        <label htmlFor="old_password">Current Password</label>
      </div>
      <div className="mb-2">
        <input type="password" name="old_password" required className="mt-2 block text-md w-full rounded-md border-0 px-3 py-1 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"/>
      </div>
      <div className="mb-2">
        <label htmlFor="new_password">New Password</label>
      </div>
      <div className="mb-2">
        <input type="password" name="new_password" required className="mt-2 block text-md w-full rounded-md border-0 px-3 py-1 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"/>
      </div>
      <div className="mb-2">
        <label htmlFor="verify_password">Confirm New Password</label>
      </div>
      <div className="mb-2">
        <input type="password" name="verify_password" required className="mt-2 block text-md w-full rounded-md border-0 px-3 py-1 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"/>
      </div>
      <div className="text-center">
        <button type="submit" className="flex w-full justify-center rounded-md mt-10 bg-gradient-to-br from-customGreen-200 via-customGreen-400 to-customGreen-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gradient-to-bl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Change Password</button>
      </div>
      
    </form>
  );
}
