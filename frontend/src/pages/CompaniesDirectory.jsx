import { useEffect } from "react";
import Header from "../components/Header";
import OrganizationCard from "../components/OrganizationCard";
import { useState } from "react";
import axios from "../api/axios";

export default function CompaniesDirectory() {
  const [companiesData, setCompaniesData] = useState([]);
  const [errors, setErrors] = useState("");

  const queryCompanies = () => {
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
  };

  useEffect(() => {
    queryCompanies();
  }, []);

  return (
    <>
      <Header />
      {errors}
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
