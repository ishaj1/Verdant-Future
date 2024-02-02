import { useState } from "react";

import LoginForm from "../components/LoginForm";
import Header from "../components/Header";

export default function HomePage({
  isLoggedIn,
  setIsLoggedIn,
  userInformation,
  setUserInformation,
}) {
  const [loginForm, setLoginForm] = useState(false);

  return (
    <>
      <h1>Home</h1>
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setUserInformation={setUserInformation}
        userInformation={userInformation}
      />
      <button
        onClick={() => {
          setLoginForm(true);
        }}
      >
        Login
      </button>
      {loginForm && (
        <LoginForm
          isLoggedIn={isLoggedIn}
          loginActive={loginForm}
          setIsLoggedIn={setIsLoggedIn}
          setLoginActive={setLoginForm}
          setUserInformation={setUserInformation}
        />
      )}
    </>
  );
}
