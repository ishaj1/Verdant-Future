import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect } from "react";

const profile = {
  name: "name",
  description: "description",
};

export default function ProfilePage({
  isLoggedIn,
  setIsLoggedIn,
  userInformation,
  setUserInformation,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate("/");
  });

  const uid = useParams().id;
  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setUserInformation={setUserInformation}
        userInformation={userInformation}
      />

      <h1>{profile.name}</h1>
      <h2>ID: {uid}</h2>
    </>
  );
}
