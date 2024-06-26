import { useLocation, useParams } from "react-router";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import UpdatePasswordForm from "../components/UpdatePasswordForm";
import fav1 from "../icons/leaves.png";
import fav2 from "../icons/green_credits.png";
import fav3 from "../icons/search.png";
import fav4 from "../icons/gear.png";
import fav5 from "../icons/password.png";
import fav6 from "../icons/trade.png";
import fav7 from "../icons/history.png";

export default function ProfilePage() {
  const path = useLocation().pathname;
  const uidmatch = /(?<=^\/profile\/|^\/company\/|^\/project\/)[^\/]*/;
  const uid = path.match(uidmatch)[0];

  const { auth } = useAuth();
  const [profileData, setProfileData] = useState();
  const [errors, setErrors] = useState();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const location = useLocation();
  const [returnMessage, setReturnMessage] = useState();
  const message = location.state && location.state.message;
  const [stripeAccountURL, setStripeAccountURL] = useState("");

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

  const queryStripeAccount = () => {
    axios
      .post(
        "/check_stripe_account",
        { username: auth.username, isProject: auth.isProject },
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      )
      .then((res) => {
        if (res?.data) {
          setStripeAccountURL(res.data.account_update_link || "#");
        }
      })
      .catch((err) => {
        setStripeAccountURL("#");
      });
  };

  useEffect(() => {
    let isProject;
    switch (path.match(/^\/[^\/]*/)[0]) {
      case "/profile":
        queryStripeAccount();
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
  }, [uid]);

  return (
    <>
      <Header />
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

      {message && (
        <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
          <div
            className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
              }}
            />
          </div>
          <div
            className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm leading-6 text-gray-900">
              <strong className="font-semibold">
                Trade Request Submitted!{" "}
              </strong>
              Please wait for a response from the organization.
            </p>
          </div>
          <div className="flex flex-1 justify-end">
            <button
              type="button"
              className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
            >
              <span className="sr-only">Dismiss</span>
            </button>
          </div>
        </div>
      )}
      {returnMessage && (
        <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
          <div
            className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
              }}
            />
          </div>
          <div
            className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm leading-6 text-gray-900">{returnMessage}</p>
          </div>
          <div className="flex flex-1 justify-end">
            <button
              type="button"
              className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
            >
              <span className="sr-only">Dismiss</span>
            </button>
          </div>
        </div>
      )}

      {profileData && (
        <>
          <header className="bg-white shadow">
            <div className="mx-12 max-w-7xl px-4 py-6 sm:px-6 lg:px-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Welcome,{" "}
                {profileData.isProject
                  ? profileData.project_name
                  : profileData.company_name}
              </h1>
            </div>
          </header>

          <main className="mb-10">
            <div className="font-lato grid grid-cols-1 md:grid-cols-3 gap-12 bg-white p-4 px-20 h-full">
              {/* Green credits */}
              {!profileData.isProject && auth?.username === uid && (
                <div className="bg-customGreen-100 bg-opacity-30 p-4 my-10 rounded-lg shadow-md  transition-colors duration-300 ease-in-out h-full">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <img src={fav2} alt="Favicon" className="w-20 h-20 m-2" />
                    </div>
                    <div className="bottom-0 right-0">
                      <h3 className="text-right text-lg font-montserrat font-semibold">
                        Green credits:{" "}
                        <span className="font-normal">
                          {profileData.total_credits}
                        </span>
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Evaluation */}
              {!profileData.isProject && auth?.username === uid && (
                <Link to="/evaluation">
                  <div className="bg-customGreen-100 bg-opacity-30 p-4 my-10 rounded-lg shadow-md hover:bg-customGreen-200 transition-colors duration-300 ease-in-out h-full">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <img
                          src={fav1}
                          alt="Favicon"
                          className="w-20 h-20 m-2"
                        />
                      </div>
                      <div className="bottom-0 right-0">
                        <h3 className="text-right text-lg font-montserrat font-semibold">
                          Get Evaluated
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Funding Progress */}
              {profileData.funds_required > 0 && (
                <div className="bg-customGreen-100 bg-opacity-30 p-4 my-10 rounded-lg shadow-md  transition-colors duration-300 ease-in-out  h-full">
                  <div className="flex flex-col justify-between h-full">
                    <h2 className="text-lg font-semibold mb-4">Fundraising</h2>
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-base font-medium text-customGreen-700 ">
                            Progress
                          </span>
                          <span className="text-sm font-medium text-customGreen-700 dark:text-white">
                            {Math.round(
                              (profileData.funds_received /
                                profileData.funds_required) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-customGreen-600 h-2.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                Math.max(
                                  (profileData.funds_received /
                                    profileData.funds_required) *
                                    100,
                                  0
                                ),
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="mb-8 text-right text-gray-600">
                        <p className="text-md ">
                          Funds Received: {profileData.funds_received}
                        </p>
                        <p className="text-md">
                          Funding Goal: {profileData.funds_required}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pending Trading Request */}
              {!auth.isProject && (
                <Link to="/pending-trades">
                  <div className="bg-customGreen-100 bg-opacity-30 p-4 my-10 rounded-lg shadow-md hover:bg-customGreen-200 transition-colors duration-300 ease-in-out h-full">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <img
                          src={fav6}
                          alt="Favicon"
                          className="w-20 h-20 m-2 p-2"
                        />
                      </div>
                      <div className="bottom-0 right-0">
                        <h3 className="text-right text-lg font-montserrat font-semibold">
                          Pending Trade Requests
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Transaction History */}
              {auth.username == uid && (
                <Link to="/transaction-history">
                  <div className="bg-customGreen-100 bg-opacity-30 p-4 my-10 rounded-lg shadow-md hover:bg-customGreen-200 transition-colors duration-300 ease-in-out h-full">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <img
                          src={fav7}
                          alt="Favicon"
                          className="w-20 h-20 m-2 p-2"
                        />
                      </div>
                      <div className="bottom-0 right-0">
                        <h3 className="text-right text-lg font-montserrat font-semibold">
                          Transaction History
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Browse Organizations */}
              {profileData && auth?.username === uid && (
                <Link to="/companies">
                  <div className="bg-customGreen-100 bg-opacity-30 p-4 my-10 rounded-lg shadow-md hover:bg-customGreen-200 transition-colors duration-300 ease-in-out h-full">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <img
                          src={fav3}
                          alt="Favicon"
                          className="w-20 h-20 m-2 p-2"
                        />
                      </div>
                      <div className="bottom-0 right-0">
                        <h3 className="text-right text-lg font-montserrat font-semibold">
                          Browse Companies
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Browse Organizations */}
              {profileData && auth?.username === uid && (
                <Link to="/projects">
                  <div className="bg-customGreen-100 bg-opacity-30 p-4 my-10 rounded-lg shadow-md hover:bg-customGreen-200 transition-colors duration-300 ease-in-out h-full">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <img
                          src={fav3}
                          alt="Favicon"
                          className="w-20 h-20 m-2 p-2"
                        />
                      </div>
                      <div className="bottom-0 right-0">
                        <h3 className="text-right text-lg font-montserrat font-semibold">
                          Browse Projects
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Update */}
              {auth?.username === uid && (
                <div className="bg-customGreen-100 bg-opacity-30 p-4 my-10 rounded-lg shadow-md hover:bg-customGreen-200 transition-colors duration-300 ease-in-out h-full">
                  <Link to="/profile/update">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <img
                          src={fav4}
                          alt="Favicon"
                          className="w-20 h-20 m-2 p-1"
                        />
                      </div>
                      <div className="bottom-0 right-0">
                        <h3 className="text-right text-lg font-montserrat font-semibold">
                          Update Your Profile
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Change password */}
              {auth?.username === uid && (
                <>
                  <div className="font-montserrat bg-customGreen-100 bg-opacity-30 p-4 my-10 hover:bg-customGreen-100 rounded-lg shadow-md transition-colors duration-300 ease-in-out h-full">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <button
                          onClick={() => {
                            setShowPasswordForm(true);
                            setErrors();
                            setReturnMessage();
                          }}
                        >
                          <img
                            src={fav5}
                            alt="Favicon"
                            className="w-20 h-20 m-2"
                          />
                        </button>
                      </div>
                      <div className="bottom-0 right-0">
                        <h3 className="text-right text-lg font-montserrat font-semibold">
                          <button
                            onClick={() => {
                              setShowPasswordForm(true);
                              setErrors();
                              setReturnMessage();
                            }}
                          >
                            Update Password
                          </button>
                        </h3>
                      </div>

                      {showPasswordForm && (
                        <>
                          <UpdatePasswordForm
                            setReturnMessage={setReturnMessage}
                            setErrorMessage={setErrors}
                            setShowForm={setShowPasswordForm}
                          />
                          <button
                            onClick={() => {
                              setShowPasswordForm(false);
                            }}
                            className="flex mb-4 w-full justify-center rounded-md bg-customGreen-300 opacity-70 px-3 py-1.5 text-sm text-customGreen-800 font-semibold leading-6 text-white shadow-sm hover:bg-customGreen-500 hover:opacity-90 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
              <a
                href={stripeAccountURL}
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="bg-customGreen-100 bg-opacity-30 p-4 my-10 rounded-lg shadow-md hover:bg-customGreen-200 transition-colors duration-300 ease-in-out h-full">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <img
                        src={fav4}
                        alt="Favicon"
                        className="w-20 h-20 m-2 p-1"
                      />
                    </div>
                    <div className="bottom-0 right-0">
                      <h3 className="text-right text-lg font-montserrat font-semibold">
                        Update Payment Information
                      </h3>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </main>
        </>
      )}
    </>
  );
}
