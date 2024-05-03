import { useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import Header from "../components/Header";

function RegisterForm() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();

  const [isProject, setIsProject] = useState(true);
  const [errors, setErrors] = useState();

  const changeRegistration = () => {
    setIsProject((prevState) => !prevState);
  };

  const registerUser = (e) => {
    e.preventDefault();
    const form = e.currentTarget.elements;
    const orgName = form.orgName.value;
    const projectAssociation = form.projectAssociation?.value;
    const username = form.username.value;
    const password = form.password.value;
    const contactName = form.contactName.value;
    const contactEmail = form.contactEmail.value;
    const orgDescription = form.orgDescription.value;
    const funds = form.funds.value;

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
    };

    axios
      .post("/registerAuth", registrationData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((response) => {
        if (response.data.register === true) {
          setAuth({ username, isProject });
          navigate(`/profile/${username}`);
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
      <Header />


      <div className="relative h-screen">
        <div className="flex justify-center items-start py-10">
          <div className="font-montserrat w-full max-w-md p-10 bg-white shadow-md rounded-md">
            <h1 className="font-opensans font-bold text-center text-2xl text-bold leading-9 tracking-tight text-gray-900 mb-3">Get Verdant today</h1>

            <div className="py-5 flex justify-end">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isProject}
                  onChange={() => changeRegistration()}
                  className="sr-only peer"
                  id="project"
                />
                <div className="ms-3 mr-3 text-sm font-medium text-gray-500 dark:text-gray-300">
                  {isProject ? "Project" : "Company"}
                </div>
                <div
                  className={`relative w-11 h-6 rounded-full ${
                    isProject ? "bg-customGreen-600" : "bg-customGreen-200"
                  } peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600`}
                ></div>
              </label>
            </div>

            { errors  && 
              <div class="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <span class="sr-only">Info</span>
                <div>
                  <span class="font-medium">{errors}</span>
                </div>
              </div>
            }

            <form className="RegisterForm" onSubmit={(e) => registerUser(e)}>
              <div class="relative mb-5">
                  <input type="text" name="orgName" required class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" " />
                  <label htmlFor="orgName" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">{isProject ? "Project" : "Company"} Name</label>
              </div>

              {isProject &&
                <div class="relative mb-5">
                    <input type="text" name="projectAssociation" required class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" " />
                    <label htmlFor="projectAssociation" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Project Association</label>
                </div>
              }

              <div class="relative mb-5">
                  <input type="text" name="username" required class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" " />
                  <label htmlFor="username" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Username</label>
              </div>

              <div class="relative mb-5">
                  <input type="password" name="password" required class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" " />
                  <label htmlFor="password" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Password</label>
              </div>
              
              
              <div class="relative mb-5">
                  <input type="text" name="contactName" required id="floating_filled" class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" " />
                  <label htmlFor="contactName" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Contact Name</label>
              </div>

              <div class="relative mb-5">
                  <input type="email" name="contactEmail" required class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" " />
                  <label htmlFor="contactEmail" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Contact Email</label>
              </div>

              <div class="relative mb-5">
                  <textarea maxLength={500} name="orgDescription" required  class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" " />
                  <label htmlFor="orgDescription" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Tell us a bit more about your organization</label>
              </div>

              <div class="relative mb-5">
                <input
                    type="number"
                    min="0"
                    max="99999999999999999.99"
                    step=".01"
                    defaultValue="0"
                    name="funds"
                    required
                    class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer"
                    placeholder=" " />
                  
                  <label htmlFor="funds" 
                    class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                    Amount of Funds (USD)(0 if not looking for funds)</label>
              </div>

              <div class="relative mb-5">
                  <input type="text" name="paymentID" required class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" " />
                  <label htmlFor="paymentID" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Payment ID</label>
              </div>

              <button type="submit" className="flex w-full justify-center rounded-md bg-gradient-to-br from-customGreen-300 via-customGreen-400 to-customGreen-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gradient-to-bl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterForm;
