import { useState } from "react";

import LoginForm from "../components/LoginForm";
import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [loginForm, setLoginForm] = useState(false);

  return (
    <>
      <Header />
     
    </>
  );
}
