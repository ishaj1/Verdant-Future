import { useState } from "react";

import LoginForm from "../components/LoginForm";
import Header from "../components/Header";

export default function HomePage() {
  const [loginForm, setLoginForm] = useState(false);

  return (
    <>
      <h1>Home</h1>
      <Header />
      <button
        onClick={() => {
          setLoginForm(true);
        }}
      >
        Login
      </button>
      {loginForm && (
        <LoginForm loginActive={loginForm} setLoginActive={setLoginForm} />
      )}
    </>
  );
}
