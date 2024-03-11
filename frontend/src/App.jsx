import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import OrganizationsDirectory from "./pages/OrganizationsDirectory";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Transaction from "./pages/Transaction";
import RequireAuth from "./components/RequireAuth";

import "./App.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/profile/:id",
      element: <RequireAuth children={<Profile />}></RequireAuth>,
    },
    {
      path: "/project/:id",
      element: (
        <RequireAuth>
          <Profile />
        </RequireAuth>
      ),
    },
    {
      path: "/company/:id",
      element: (
        <RequireAuth>
          <Profile />
        </RequireAuth>
      ),
    },
    {
      path: "/projects",
      element: <RequireAuth children={<OrganizationsDirectory />} />,
    },
    {
      path: "/transaction",
      element: <Transaction />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
