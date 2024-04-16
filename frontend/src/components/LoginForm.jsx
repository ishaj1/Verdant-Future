import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

function LoginForm({ setLoginActive }) {
  const { setAuth } = useAuth();
  const [isProject, setIsProject] = useState();
  const [errors, setErrors] = useState();
  const loginRef = useRef(null);
  const navigate = useNavigate();

  // handles getting rid of the login popup box when clicking outside of it
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

    const form = e.currentTarget;
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
          setAuth({ username });
          navigate("/projects");
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

        <div className="mt-10 mb-5">
          <h1 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-3">Sign in to your account </h1>
          <p className="text-center text-md text-gray-500"> Not a member? <a href="/register" className="text-customGreen-300">Sign up</a></p>
          
        </div>

        
        {errors && <p>{errors}</p>}
        {/* <h2>{isProject ? "Project" : "Company"} Login</h2> */}
        <form
          id="loginform"
          className="LoginForm"
          onSubmit={(e) => loginUser(e)}
        >
          <label htmlFor="username">Username</label>
          <input type="text" name="username" className="block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"  required />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" className="block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"  required />
          <input type="submit" value="Login" className="flex w-full justify-center rounded-md bg-customGreen-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-customGreen-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" />
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
