import { useEffect } from "react";
import Header from "../components/Header";
import OrganizationCard from "../components/OrganizationCard";
import { useState } from "react";
import axios from "../api/axios";

export default function OrganizationsDirectory() {
  const [companiesData, setCompaniesData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [errors, setErrors] = useState("");

  const queryOrganizations = () => {
    axios
      .get("/view_companies")
      .then((response) => {
        if (response?.data) {
          setErrors();
          setCompaniesData(response.data);
        }
      })
      .catch((error) => {
        setErrors("Error retrieving company data.");
      });

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
      {companiesData.map((org, index) => (
        <OrganizationCard
          description={org.company_details}
          key={index}
          name={org.company_name}
          profile_link={`/company/${org.company_username}`}
        />
      ))}
    </>
  );
}
