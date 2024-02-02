import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({
  isLoggedIn,
  setIsLoggedIn,
  setLoginActive,
  setUserInformation,
}) {
  const [isProject, setIsProject] = useState();
  const loginRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate(`/projects`);
  }, [isLoggedIn, setIsLoggedIn]);

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
    setUserInformation({ username: "test" });
    setIsLoggedIn(true);
    localStorage.setItem("token", "tmptoken");
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
