import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function UpdateProfileForm() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState();
  const [curProfileData, setCurProfileData] = useState({});

  const queryProfileData = (username, isProject) => {
    axios
      .get("/display_profile", {
        params: { username, isProject },
      })
      .then((response) => {
        setCurProfileData({ ...response.data.records, isProject });
      })
      .catch((error) => {});
  };

  const updateProfile = (e) => {
    e.preventDefault();
    const form = e.currentTarget.elements;
    const orgName = form.orgName.value;
    const projectAssociation = form.projectAssociation?.value;
    const contactName = form.contactName.value;
    const contactEmail = form.contactEmail.value;
    const orgDescription = form.orgDescription.value;
    const fundsRequired = form.fundsRequired.value;
    // const fundsReceived = form.fundsReceived.value;
    // const paymentID = form.paymentID.value;
    const fundsReceived = curProfileData?.funds_received;
    const paymentID = curProfileData?.payment_id;

    const profileData = {
      name: orgName,
      isProject: auth.isProject,
      ...(auth.isProject ? { association: projectAssociation } : {}),
      username: auth.username,
      contact_name: contactName,
      contact_email: contactEmail,
      details: orgDescription,
      funds_required: fundsRequired,
      funds_received: fundsReceived,
      payment_id: paymentID,
    };

    axios
      .post("/update_profile", profileData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((response) => {
        if (response.data.update === true) {
          setErrors();
          navigate(`/profile/${auth.username}`);
        } else {
          setErrors(
            "Could not update profile. Please check information submitted."
          );
        }
      })
      .catch((error) => {
        setErrors("Error updating profile. Please try again.");
      });
  };

  useEffect(() => {
    queryProfileData(auth.username, auth.isProject);
  }, []);

  console.log(errors);
  return (
    <>
      <Header />

      <div className="relative h-full bg-customGreen-50">
        <div className="flex justify-center items-start py-10">
          <div className="w-full max-w-md p-10 bg-white shadow-md rounded-md font-montserrat">
            <h1 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-10">
              Update your profile
            </h1>
            {errors && (
              <div
                className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                <svg
                  className="flex-shrink-0 inline w-4 h-4 me-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="font-medium">{errors}</span>
                </div>
              </div>
            )}

            <form
              className="UpdateProfileForm"
              onSubmit={(e) => updateProfile(e)}
            >
              <div className="my-4 relative">
                <input
                  type="text"
                  name="orgName"
                  id="orgName"
                  defaultValue={
                    auth.isProject
                      ? curProfileData?.project_name
                      : curProfileData?.company_name
                  }
                  required
                  className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer"
                />
                <label
                  htmlFor="orgName"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  {auth.isProject ? "Project" : "Company"} Name
                </label>
              </div>

              {auth.isProject && (
                <>
                  <div className="my-4 relative">
                    <input
                      type="text"
                      name="projectAssociation"
                      id="projectAssociation"
                      defaultValue={curProfileData?.project_association}
                      required
                      className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer"
                    />
                    <label
                      htmlFor="projectAssociation"
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                    >
                      Project Association
                    </label>
                  </div>
                </>
              )}

              <div className="my-4 relative">
                <input
                  type="text"
                  name="contactName"
                  id="contactName"
                  defaultValue={curProfileData?.contact_name}
                  required
                  className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer"
                />
                <label
                  htmlFor="contactName"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  Contact Name
                </label>
              </div>

              <div className="my-4 relative">
                <input
                  type="email"
                  name="contactEmail"
                  id="contactEmail"
                  defaultValue={curProfileData?.contact_detail}
                  required
                  className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer"
                />
                <label
                  htmlFor="contactEmail"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  Contact Email
                </label>
              </div>

              <div className="my-4 relative">
                <textarea
                  maxLength={500}
                  name="orgDescription"
                  id="orgDescription"
                  defaultValue={
                    auth.isProject
                      ? curProfileData?.project_details
                      : curProfileData?.company_details
                  }
                  required
                  className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer"
                ></textarea>
                <label
                  htmlFor="orgDescription"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  Description of Your Organization
                </label>
              </div>

              <div className="my-4 relative">
                <input
                  type="number"
                  min="0"
                  max="99999999999999999.99"
                  step=".01"
                  defaultValue={curProfileData?.funds_required}
                  name="fundsRequired"
                  id="fundsRequired"
                  required
                  className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer"
                />
                <label
                  htmlFor="fundsRequired"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  Fund Goal (0 if you are not looking for funds)
                </label>
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded-md mt-10 bg-gradient-to-br from-customGreen-200 via-customGreen-400 to-customGreen-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gradient-to-bl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateProfileForm;
