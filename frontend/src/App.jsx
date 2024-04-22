import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import CompaniesDirectory from "./pages/CompaniesDirectory";
import ProjectsDirectory from "./pages/ProjectsDirectory";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Transaction from "./pages/Transaction";
import Evaluation from "./pages/Evaluation";
import RequireAuth from "./components/RequireAuth";
import EvaluationSuccess from "./pages/EvaluationSuccess";
import UpdateProfileForm from "./components/UpdateProfileForm";
import TransactionResult from "./pages/TransactionResult";

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
      path: "/profile/update",
      element: <RequireAuth children={<UpdateProfileForm />} />,
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
      path: "/companies",
      element: <RequireAuth children={<CompaniesDirectory />} />,
    },
    { path: "/projects", element: <RequireAuth children={<ProjectsDirectory />} /> },
    {
      path: "/transaction",
      element: <RequireAuth children={<Transaction />} />,
    },
    {
      path: "/transaction-success",
      element: <RequireAuth children={<TransactionResult />} />,
    },
    { path: "/evaluation", element: <RequireAuth children={<Evaluation />} /> },
    {
      path: "/evaluation-success",
      element: <RequireAuth children={<EvaluationSuccess />} />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
