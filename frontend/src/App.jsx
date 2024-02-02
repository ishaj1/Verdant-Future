import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import ProjectsDirectory from "./pages/OrganizationsDirectory";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInformation, setUserInformation] = useState({});

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Home
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          userInformation={userInformation}
          setUserInformation={setUserInformation}
        />
      ),
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/profile/:id",
      element: (
        <Profile
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          userInformation={userInformation}
          setUserInformation={setUserInformation}
        />
      ),
    },
    {
      path: "/projects",
      element: (
        <ProjectsDirectory
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          userInformation={userInformation}
          setUserInformation={setUserInformation}
        />
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
