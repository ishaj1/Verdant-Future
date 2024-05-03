import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import OrganizationsDirectory from "./pages/OrganizationsDirectory";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Transaction from "./pages/Transaction";
import Evaluation from "./pages/Evaluation";
import RequireAuth from "./components/RequireAuth";
import EvaluationSuccess from "./pages/EvaluationSuccess";
import UpdateProfileForm from "./components/UpdateProfileForm";
import TransactionResult from "./pages/TransactionResult";
import PendingTransactions from "./pages/PendingTransactions";
import TransactionHistory from "./pages/TransactionHistory";

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
      path: "/organizations",
      element: (
        <RequireAuth children={<OrganizationsDirectory show="organizations" />} />
      ),
    },
    {
      path: "/projects",
      element: <RequireAuth children={<OrganizationsDirectory show="projects" />} />,
    },
    {
      path: "/companies",
      element: <RequireAuth children={<OrganizationsDirectory show="companies" />} />,
    },
    {
      path: "/transaction",
      element: <RequireAuth children={<Transaction />} />,
    },
    {
      path: "/transaction-success",
      element: <RequireAuth children={<TransactionResult />} />,
    },
    {
      path: "/pending-trades",
      element: <RequireAuth children={<PendingTransactions />} />,
    },
    {
      path: "/transaction-history",
      element: <RequireAuth children={<TransactionHistory />} />,
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
