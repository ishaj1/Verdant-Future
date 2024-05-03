import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

function LoginForm({ setLoginActive }) {
  const { setAuth } = useAuth();
  const [isProject, setIsProject] = useState(true);
  const [errors, setErrors] = useState();
  const loginRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setLoginActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [loginRef]);

  const changeLogin = (e) => {
    setIsProject(e.target.id === "project");
  };

  const loginUser = (e) => {
    e.preventDefault();

    const form = e.currentTarget.elements;
    const username = form.username.value;
    const password = form.password.value;
    const loginData = {
      isCompany: !isProject,
      username,
      password,
    };

    axios
      .post("/login", loginData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((response) => {
        if (response.data.user == true) {
          setAuth({ username, isProject });
          navigate(`/profile/${username}`);
        } else {
          setErrors(
            "Incorrect login information. Please check your username and password, and try again."
          );
        }
      })
      .catch((errors) => {
        setErrors("Error logging in. Please try again.");
      });
  };

  return (
    <div className="LoginWindow">
      <div className="LoginContent" ref={loginRef}>
  
        <div className="TypeSelector">
            <button
              className={isProject ? "selected" : ""}
              id="project"
              onClick={changeLogin}
            >
              Project
            </button>
            <button
              className={isProject ? "" : "selected"}
              id="company"
              onClick={changeLogin}
            >
              Company
            </button>
        </div>

        <div className="mt-10 mb-5 font-montserrat">
          <h1 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-3">Sign in to your account </h1>
          <p className="text-center text-md text-gray-500"> Not a member? <a href="/register" className="text-customGreen-300">Sign up</a></p>
          
        </div>

        
        { errors  && 
            <div class="flex items-center p-4 m-4 mx-14 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
              </svg>
              <span class="sr-only">Info</span>
              <div>
                <span class="font-medium">{errors}</span>
              </div>
            </div>
          }
        <form
          id="loginform"
          className="LoginForm"
          onSubmit={(e) => loginUser(e)}
        >
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" className="block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"  required />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" className="block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"  required />
          <input type="submit" value="Login" className="flex w-full justify-center rounded-md bg-gradient-to-br from-customGreen-300 via-customGreen-400 to-customGreen-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gradient-to-bl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" />
        </form>
 
      </div>
    </div>
  );
}

export default LoginForm;
