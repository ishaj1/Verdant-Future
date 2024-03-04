import { useParams } from "react-router";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function ProfilePage() {
  const uid = useParams().id;
  const [profileData, setProfileData] = useState({});
  const [errors, setErrors] = useState("");

  const queryProfileData = (username) => {
    axios
      .get("/display_company_profile", {
        params: { company_username: username },
      })
      .then((response) => {
        if (response.data.message == "No company found!") {
          setErrors("User Not Found");
        } else {
          return response.data;
        }
      })
      .catch((error) => {
        setErrors("Error retrieveing profile data. Please try again later.");
      });
  };

  useEffect(() => {
    setProfileData(queryProfileData(uid));
  });

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
          <p>Contact Details: {profileData.contact_details}</p>
          <p>Description: {profileData.company_details}</p>
        </>
      )}
    </>
  );
}
