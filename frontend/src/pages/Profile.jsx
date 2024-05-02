import { useLocation, useParams } from "react-router";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import UpdatePasswordForm from "../components/UpdatePasswordForm";
import InitiateTransactionForm from "../components/InitiateTransactionForm";
import TransactionHistory from "../components/TransactionHistory";
import PendingTransactions from "../components/PendingTransactions";

export default function ProfilePage() {
  const path = useLocation().pathname;
  const uidmatch = /(?<=^\/profile\/|^\/company\/|^\/project\/)[^\/]*/
  const uid = path.match(uidmatch)[0];
  const { auth } = useAuth();
  const [profileData, setProfileData] = useState();
  const [errors, setErrors] = useState();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [numTransactionResponses, setNumTransactionResponses] = useState(0);

  const queryProfileData = (username, isProject) => {
    axios
      .get("/display_profile", {
        params: { username, isProject },
      })
      .then((response) => {
        if (response?.data?.records) {
          setErrors();
          setProfileData({ ...response.data.records, isProject });
        } else {
          setErrors("User Not Found");
        }
      })
      .catch((error) => {
        setErrors("Error retrieveing profile data. Please try again later.");
      });
  };

  useEffect(() => {
    let isProject;
    switch (path.match(/^\/[^\/]*/)[0]) {
      case "/profile":
        isProject = auth.isProject;
        break;
      case "/project":
        isProject = true;
        break;
      case "/company":
        isProject = false;
        break;
    }
    queryProfileData(uid, isProject);
  }, [uid]);

  return (
    <>
      <Header />
      {errors}
      {profileData && (
        <>
          <h1>
            {profileData.isProject
              ? profileData.project_name
              : profileData.company_name}
          </h1>
          {auth?.isProject === false && auth?.username != uid && (
            <>
              <button
                onClick={() => {
                  setShowTransactionForm(true);
                }}
              >
                {profileData.isProject ? "Invest" : "Trade"}
              </button>
              {showTransactionForm && (
                <>
                  <InitiateTransactionForm uid={uid} isTrade={!profileData.isProject} />
                  <button onClick={() => setShowTransactionForm(false)}>Cancel</button>
                </>
              )}
            </>
          )}
          {auth?.username === uid && <Link to="/profile/update">Update Profile</Link>}
          {!profileData.isProject && auth?.username === uid && (
            <Link to="/evaluation">Request Evaluation</Link>
          )}
          <p>Funds Received: {profileData.funds_received}</p>
          <p>Funding Goal: {profileData.funds_required}</p>
          {auth?.username === uid && <p>Payment ID: {profileData.payment_id}</p>}
          {profileData.isProject ? (
            <>
              <p>Project Association: {profileData.project_association}</p>
              <p>Username: {profileData.project_username}</p>
              <p>Description: {profileData.project_details}</p>
            </>
          ) : (
            <>
              <p>Green Credits: {profileData.total_credits}</p>
              <p>Username: {profileData.company_username}</p>
              <p>Description: {profileData.company_details}</p>
            </>
          )}
          <p>Contact Name: {profileData.contact_name}</p>
          <p>Contact Details: {profileData.contact_detail}</p>
          {auth?.username === uid && (
            <>
              <p style={{ display: "inline" }}>Password: ********</p>
              <button
                onClick={() => {
                  setShowPasswordForm(true);
                  setErrors();
                }}
              >
                Update Password
              </button>
              {showPasswordForm && (
                <>
                  <UpdatePasswordForm
                    setReturnMessage={setErrors}
                    setShowForm={setShowPasswordForm}
                  />
                  <button
                    onClick={() => {
                      setShowPasswordForm(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </>
          )}
          <div>
            <PendingTransactions
              numTransactionResponses={numTransactionResponses}
              setNumTransactionResponses={setNumTransactionResponses}
            />
            <TransactionHistory key={numTransactionResponses} />
          </div>
        </>
      )}
    </>
  );
}
