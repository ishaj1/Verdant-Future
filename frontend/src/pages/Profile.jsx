import { useLocation, useParams } from "react-router";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const path = useLocation().pathname;
  const uid = useParams().id;
  const { auth } = useAuth();
  const [profileData, setProfileData] = useState();
  const [errors, setErrors] = useState();

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
  }, []);

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
          {!profileData.isProject && auth?.username === uid && (
            <Link to="/evaluation">Request Evaluation</Link>
          )}
          <p>Funds Received: {profileData.funds_received}</p>
          <p>Funding Goal: {profileData.funds_required}</p>
          {auth?.username === uid && (
            <p>Payment ID: {profileData.payment_id}</p>
          )}
          {profileData.isProject ? (
            <>
              <p>Project Association: {profileData.project_association}</p>
              <p>Username: {profileData.project_username}</p>
              <p>Description: {profileData.project_details}</p>
            </>
          ) : (
            <>
              <p>Green Credits: {profileData.green_credits}</p>
              <p>Username: {profileData.company_username}</p>
              <p>Description: {profileData.company_details}</p>
            </>
          )}

          <p>Contact Name: {profileData.contact_name}</p>
          <p>Contact Details: {profileData.contact_detail}</p>
        </>
      )}
    </>
  );
}
