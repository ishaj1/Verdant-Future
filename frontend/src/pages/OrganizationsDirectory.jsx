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
      <div className="relative h-screen">
        <div className="flex justify-center items-start py-10">
          <div className="font-montserrat w-full max-w-6xl p-10 bg-white shadow-md rounded-md">
            <h1 className="font-semibold font-montserrat text-xl text-center m-3">View Projects & Companies</h1>
            {errors}
            {projectsData && projectsData.map((org, index) => (
              <OrganizationCard
                description={org.project_details}
                key={index}
                name={org.project_name}
                profile_link={`/project/${org.project_username}`}
                project_association={org.project_association}
                contact_name={org.contact_name}
                contact_detail={org.contact_detail}
                funds_received={org.funds_received}
                funds_required={org.funds_required}
              />
            ))}
            {companiesData && companiesData.map((org, index) => (
              <OrganizationCard
              description={org.company_details}
              key={index}
              name={org.company_name}
              profile_link={`/company/${org.company_username}`}
              contact_name={org.contact_name}
              contact_detail={org.contact_detail}
              funds_received={org.funds_received}
              funds_required={org.funds_required}
            />            
            
            ))}
          </div>
        </div>
      </div>
    </>
  );
}