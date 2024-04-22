import { useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";

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
    const form = e.currentTarget;
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
      {/* navigation */}
      <header
        className="flex items-center justify-between bg-customGreen-600 px-3 py-3 lg:px-12"
        aria-label="Main"
      >
        <a href="/" className="text-3xl font-bold text-white pt-5 pb-5 ">
          Verdant Future
        </a>
        <nav>
          <ul className="hidden gap-8 md:flex text-white font-abeezee">
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
              <a href="/register" className="bg-customGreen-800 px-4 py-2 rounded-xl">
                Sign up
              </a>
            </li>
          </ul>

          <details className="flex md:hidden">
            <summary className="bg-costomGreen-600 hover:bg-customGreen-200 [[open]>&]:bg-customGreen-200 _no-triangle grid h-10 w-10 place-items-center rounded-full cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
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
                      <a
                        href="/register"
                        className="bg-customGreen-800 px-4 py-2 rounded-xl text-white"
                      >
                        Sign up
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </details>
        </nav>
      </header>
      {loginForm && <LoginForm loginActive={loginForm} setLoginActive={setLoginForm} />}

      <div className="relative h-screen">
        <div className="flex justify-center items-start py-10">
          <div className="w-full max-w-md p-10 bg-white shadow-md rounded-md">
            <h1 className="text-center text-2xl leading-9 tracking-tight text-gray-900 mb-3">
              Get Verdant today
            </h1>

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

            <p>{errors}</p>

            <form className="RegisterForm" onSubmit={(e) => registerUser(e)}>
              <div className="">
                <label htmlFor="orgName">
                  {isProject ? "Project" : "Company"} Name
                </label>
                <input
                  type="text"
                  name="orgName"
                  className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"
                  required
                />
                {isProject && (
                  <div className="my-4">
                    <label htmlFor="projectAssociation">Project Association</label>
                    <input
                      type="text"
                      name="projectAssociation"
                      required
                      className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"
                    />
                  </div>
                )}
              </div>
              <div className="my-4">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  required
                  className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"
                />
              </div>
              <div className="my-4">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"
                />
              </div>
              <div className="my-4">
                <label htmlFor="contactName">Contact Name</label>
                <input
                  type="text"
                  name="contactName"
                  required
                  className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"
                />
              </div>
              <div className="my-4">
                <label htmlFor="contactEmail">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  required
                  className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"
                />
              </div>
              <div className="my-4">
                <label htmlFor="orgDescription">
                  Tell us a bit more about your organization
                </label>
                <textarea
                  maxLength={500}
                  name="orgDescription"
                  required
                  className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"
                ></textarea>
              </div>
              <div className="my-4">
                <label htmlFor="funds">
                  Amount of Funds You Are Aiming to Reach (0 if you are not looking for
                  funds)
                </label>
              </div>
              <div className="my-4">
                <input
                  type="number"
                  min="0"
                  max="99999999999999999.99"
                  step=".01"
                  defaultValue="0"
                  name="funds"
                  required
                  className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"
                />
              </div>
              <button
                type="submit"
                className="flex mt-10 mb-6 w-full justify-center rounded-md bg-customGreen-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-customGreen-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterForm;
