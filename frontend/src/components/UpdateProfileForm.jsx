import { useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function UpdateProfileForm() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState();

  const updateProfile = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const orgName = form.orgName.value;
    const projectAssociation = form.projectAssociation?.value;
    const password = form.password.value;
    const contactName = form.contactName.value;
    const contactEmail = form.contactEmail.value;
    const orgDescription = form.orgDescription.value;
    const fundsRequired = form.fundsRequired.value;
    const fundsReceived = form.fundsReceived.value;
    const paymentID = form.paymentID.value;

    const profileData = {
      name: orgName,
      isProject: auth.isProject,
      ...(auth.isProject ? { association: projectAssociation } : {}),
      username: auth.username,
      password,
      contact_name: contactName,
      contact_email: contactEmail,
      details: orgDescription,
      funds_required: fundsRequired,
      funds_received: fundsReceived,
      payment_id: paymentID,
    };

    axios
      .post("/update_profile", profileData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((response) => {
        if (response.data.update === true) {
          setErrors();
          navigate(`/profile/${auth.username}`);
        } else {
          setErrors("Could not update profile. Please check information submitted.");
        }
      })
      .catch((error) => {
        setErrors("Error updating profile. Please try again.");
      });
  };

  return (
    <>
      <Header />
      <p>{errors}</p>
      <form className="UpdateProfileForm" onSubmit={(e) => updateProfile(e)}>
        <label htmlFor="orgName">{auth.isProject ? "Project" : "Company"} Name</label>
        <input type="text" name="orgName" required />
        {auth.isProject && (
          <>
            <label htmlFor="projectAssociation">Project Association</label>
            <input type="text" name="projectAssociation" required />
          </>
        )}

        <label htmlFor="password">Password</label>
        <input type="password" name="password" required />
        <label htmlFor="contactName">Contact Name</label>
        <input type="text" name="contactName" required />
        <label htmlFor="contactEmail">Contact Email</label>
        <input type="email" name="contactEmail" required />
        <label htmlFor="orgDescription">Description of Your Organization</label>
        <textarea maxLength={500} name="orgDescription" required></textarea>
        <label htmlFor="fundsRequired">
          Amount of Funds You Are Aiming to Reach (0 if you are not looking for funds)
        </label>
        <input
          type="number"
          min="0"
          max="99999999999999999.99"
          step=".01"
          defaultValue="0"
          name="fundsRequired"
          required
        />
        <label htmlFor="fundsReceived">Amount of Funds You Have Received</label>
        <input
          type="number"
          min="0"
          max="99999999999999999.99"
          step=".01"
          defaultValue="0"
          name="fundsReceived"
          required
        />
        <label htmlFor="paymentID">Payment ID</label>
        <input type="text" name="paymentID" required />
        <button type="submit">Update</button>
      </form>
    </>
  );
}

export default UpdateProfileForm;
