import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function LoginForm({ setLoginActive }) {
  const { setAuth } = useAuth();
  const [isProject, setIsProject] = useState();
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
    setAuth({ username: "username" });
    navigate("/projects");
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
