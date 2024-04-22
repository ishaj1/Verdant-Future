import { useEffect } from "react";
import Header from "../components/Header";
import OrganizationCard from "../components/OrganizationCard";
import { useState } from "react";
import axios from "../api/axios";

export default function ProjectsDirectory() {
  const [projectsData, setProjectsData] = useState([]);
  const [errors, setErrors] = useState("");

  const queryOrganizations = () => {
    axios
      .get("/view_projects")
      .then((response) => {
        if (response?.data) {
          setErrors();
          setProjectsData(response.data);
        }
      })
      .catch((error) => {
        setErrors(errors + "Error retreiving project data.");
      });
  };

  useEffect(() => {
    queryOrganizations();
  }, []);

  return (
    <>
      <Header />
      {errors}
      {projectsData.map((org, index) => (
        <OrganizationCard
          description={org.project_details}
          key={index}
          name={org.project_name}
          profile_link={`/project/${org.project_username}`}
        />
      ))}
    </>
  );
}
