import { useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();

  const [isProject, setIsProject] = useState(true);
  const [errors, setErrors] = useState();

  const changeRegistration = (e) => {
    setIsProject(e.target.id === "project");
  };

  const registerUser = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const orgName = form.orgName.value;
    const projectAssociation = form.projectAssociation?.value;
    const username = form.username.value;
    const password = form.password.value;
    const contactName = form.contactName.value;
    const contactEmail = form.contactEmail.value;
    const orgDescription = form.orgDescription.value;
    const funds = form.funds.value;
    const paymentID = form.paymentID.value;

    const registrationData = {
      name: orgName,
      isCompany: !isProject,
      ...(isProject ? { project_association: projectAssociation } : {}),
      username,
      password,
      contact_name: contactName,
      contact_email: contactEmail,
      details: orgDescription,
      funds_required: funds,
      funds_received: 0,
      payment_id: paymentID,
    };

    axios
      .post("/registerAuth", registrationData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((response) => {
        if (response.data.register === true) {
          setAuth({ username, isProject });
          navigate("/organizations");
        } else {
          setErrors("Error registering. Check information submitted.");
        }
      })
      .catch((error) => {
        setErrors("Error registering. Please try again.");
      });
  };
  return (
    <div className="RegistrationWindow">
      <button
        className={isProject ? "selected" : ""}
        id="project"
        onClick={changeRegistration}
      >
        Project
      </button>
      <button
        className={isProject ? "" : "selected"}
        id="company"
        onClick={changeRegistration}
      >
        Company
      </button>
      <p>{errors}</p>
      <form className="RegisterForm" onSubmit={(e) => registerUser(e)}>
        <label htmlFor="orgName">{isProject ? "Project" : "Company"} Name</label>
        <input type="text" name="orgName" required />
        {isProject && (
          <>
            <label htmlFor="projectAssociation">Project Association</label>
            <input type="text" name="projectAssociation" required />
          </>
        )}

        <label htmlFor="username">Username</label>
        <input type="text" name="username" required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" required />
        <label htmlFor="contactName">Contact Name</label>
        <input type="text" name="contactName" required />
        <label htmlFor="contactEmail">Contact Email</label>
        <input type="email" name="contactEmail" required />
        <label htmlFor="orgDescription">Description of Your Organization</label>
        <textarea maxLength={500} name="orgDescription" required></textarea>
        <label htmlFor="funds">
          Amount of Funds You Are Aiming to Reach (0 if you are not looking for funds)
        </label>
        <input
          type="number"
          min="0"
          max="99999999999999999.99"
          step=".01"
          defaultValue="0"
          name="funds"
          required
        />
        <label htmlFor="paymentID">Payment ID</label>
        <input type="text" name="paymentID" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterForm;
