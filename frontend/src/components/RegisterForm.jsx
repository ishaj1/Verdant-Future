import { useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function RegisterForm() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();

  const [isProject, setIsProject] = useState();
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
          setAuth({ username });
          navigate("/projects");
        } else {
          setErrors("Error registering. Check information submitted.");
        }
      })
      .catch((error) => {
        setErrors("Error registering. Please try again.");
      });
  };
  const [loginForm, setLoginForm] = useState(false);
  
  return (
    <>
      <header className="flex items-center justify-between bg-customGreen-600 px-3 py-3 lg:px-12" aria-label="Main">
        <h1 className="text-3xl font-bold text-white pt-5 pb-5 ">Verdant Future</h1>
        <nav>
          <ul className="hidden gap-8 md:flex text-white font-abeezee">
            <li>
              <a href="#">About US</a>
            </li>
            <li>
              <a href="#">Projects</a>
            </li>
            <li>
              <a href="#">Companies</a>
            </li>
            <li>
              <button
                onClick={() => {
                  setLoginForm(true);
                }}
              >
                Login
              </button>
            </li>
            <li>
              <a href="/register" className="bg-customGreen-800 px-4 py-2 rounded-xl">Sign up</a>
            </li>

          </ul>
          
          <details className="flex md:hidden">
            <summary className="bg-costomGreen-600 hover:bg-customGreen-200 [[open]>&]:bg-customGreen-200 _no-triangle grid h-10 w-10 place-items-center rounded-full cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
            </summary>

            <div className="absolute right-0 z-20 md:left-0">
              <div className="relative top-9 w-30 rounded-md border border-gray-100 bg-white p-1 shadow-sm ">
                <nav>
                  <ul className="flex flex-col gap-5 px-2 py-2.5 font-abeezee text-right">
                    <li>
                      <a href="#">About us</a>
                    </li>
                    <li>
                      <a href="#">Projects</a>
                    </li>
                    <li>
                      <a href="#">Companies</a>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setLoginForm(true);
                        }}
                      >
                        Login
                      </button>
                    </li>
                    <li>
                      <a href="/register" className="bg-customGreen-800 px-4 py-2 rounded-xl text-white">Sign up</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            
          </details>

        </nav>
      </header>
      {loginForm && (
                <LoginForm loginActive={loginForm} setLoginActive={setLoginForm} />
      )}


      <div className="flex justify-center">
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
          <label htmlFor="orgName">
            {isProject ? "Project" : "Company"} Name
          </label>
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
            Amount of Funds You Are Aiming to Reach (0 if you are not looking for
            funds)
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
    
    </>
  );
  
}

export default RegisterForm;
