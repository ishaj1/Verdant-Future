import { useParams } from "react-router";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

export default function ProfilePage() {
  const uid = useParams().id;
  const { auth } = useAuth();
  const [profileData, setProfileData] = useState();
  const [errors, setErrors] = useState();

  const queryProfileData = (username) => {
    axios
      .get(
        auth.isProject
          ? "/display_project_profile"
          : "/display_company_profile",
        {
          params: { company_username: username },
        }
      )
      .then((response) => {
        if (response?.data?.company_records) {
          setErrors();
          setProfileData(response.data.company_records);
        } else {
          setErrors("User Not Found");
        }
      })
      .catch((error) => {
        setErrors("Error retrieveing profile data. Please try again later.");
      });
  };

  useEffect(() => {
    queryProfileData(uid);
    console.log(profileData);
  }, [uid]);

  return (
    <>
      <Header />
      {errors}
      {profileData && (
        <>
          <h1>{profileData.company_name}</h1>
          <p>Green Credits: {profileData.green_credits}</p>
          <p>Funding Goal: {profileData.funds_required}</p>
          <p>Username: {profileData.company_username}</p>
          <p>Contact Name: {profileData.contact_name}</p>
          <p>Contact Details: {profileData.contact_detail}</p>
          <p>Description: {profileData.company_details}</p>
        </>
      )}
    </>
  );
}
