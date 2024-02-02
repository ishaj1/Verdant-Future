import { useEffect } from "react";
import Header from "../components/Header";
import OrganizationCard from "../components/OrganizationCard";
import { useNavigate } from "react-router-dom";

const test_orgs = [
  {
    name: "proj1",
    description: "desc1",
    id: 1,
  },
  {
    name: "comp2",
    description: "desc2",
    id: 2,
  },
];

export default function OrganizationsDirectory({
  isLoggedIn,
  setIsLoggedIn,
  setUserInformation,
  userInformation,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate("/");
  });
  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setUserInformation={setUserInformation}
        userInformation={userInformation}
      />
      {test_orgs.map((org, index) => (
        <OrganizationCard
          description={org.description}
          id={org.id}
          key={index}
          name={org.name}
        />
      ))}
    </>
  );
}
