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
          setAuth({ username, isProject });
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
    <div className="LoginWindow" ref={loginRef}>
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
      <p>{errors}</p>
      <form className="LoginForm" onSubmit={(e) => loginUser(e)}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" required />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
