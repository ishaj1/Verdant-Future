import { useLocation, useParams } from "react-router";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import UpdatePasswordForm from "../components/UpdatePasswordForm";
import PendingTransactions from "../components/PendingTransactions";
import TransactionHistory from "../components/TransactionHistory";
import InitiateTransactionForm from "../components/InitiateTransactionForm";
import fav1 from "../icons/leaves.png";
import fav2 from "../icons/green_credits.png";
import fav3 from "../icons/search.png";
import fav4 from "../icons/gear.png";
import fav5 from "../icons/password.png";
import fav6 from "../icons/trade.png";

export default function ProfilePage() {
  const path = useLocation().pathname;
  const uidmatch = /(?<=^\/profile\/|^\/company\/|^\/project\/)[^\/]*/;
  const uid = path.match(uidmatch)[0];
  

  const { auth } = useAuth();
  const [profileData, setProfileData] = useState();
  const [errors, setErrors] = useState();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [numTransactionResponses, setNumTransactionResponses] = useState(0);
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
  }

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
      {errors && <div>{errors}</div>}
      {profileData && (
      <>
        <header class="bg-white shadow">
          <div class="mx-12 max-w-7xl px-4 py-6 sm:px-6 lg:px-6">
            <h1 class="text-3xl font-bold tracking-tight text-gray-900">Welcome, {profileData.isProject ? profileData.project_association : profileData.company_name}</h1>
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
                    <h3 className="text-right text-lg font-montserrat font-semibold">Green credits: <span className="font-normal">{profileData.total_credits}</span></h3>
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
                      <img src={fav1} alt="Favicon" className="w-20 h-20 m-2" />
                    </div>
                    <div className="bottom-0 right-0"> 
                      <h3 className="text-right text-lg font-montserrat font-semibold">Get Evaluated</h3>
                    </div>
                  </div>
                </div>         
              </Link>
            )}



            {/* Funding Progress */}
            {(profileData.funds_required > 0) && 
              <div className="bg-customGreen-100 bg-opacity-30 p-4 my-10 rounded-lg shadow-md  transition-colors duration-300 ease-in-out  h-full">
                <div className="flex flex-col justify-between h-full">
                  <h2 className="text-lg font-semibold mb-4">Fundraising</h2>
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div class="flex justify-between mb-1">
                        <span class="text-base font-medium text-customGreen-700 ">Progress</span>
                        <span class="text-sm font-medium text-customGreen-700 dark:text-white">{(profileData.funds_received / profileData.funds_required) * 100}%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-customGreen-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, (profileData.funds_received / profileData.funds_required) * 100)}%` }}></div>
                      </div>
                    </div>

                    <div className="mb-8 text-right text-gray-600">
                      <p className="text-md ">Funds Received: {profileData.funds_received}</p>
                      <p className="text-md">Funding Goal: {profileData.funds_required}</p>
                    </div>
                  </div>
                </div>
              </div>
            }

            {/* Pending Trading Request */}
            {(profileData.funds_required > 0) && (
              <Link to="/">
                <div className="bg-customGreen-100 bg-opacity-30 p-4 my-10 rounded-lg shadow-md hover:bg-customGreen-200 transition-colors duration-300 ease-in-out h-full">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <img src={fav6} alt="Favicon" className="w-20 h-20 m-2 p-2" />
                    </div>
                    <div className="bottom-0 right-0"> 
                      <h3 className="text-right text-lg font-montserrat font-semibold">Pending Trading Requests</h3>
                    </div>
                  </div>
                </div>         
              </Link>
            )}

            {/* Browse Organizations */}
            {profileData && auth?.username === uid &&
            <Link to="/companies">
              <div className="bg-customGreen-100 bg-opacity-30 p-4 my-10 rounded-lg shadow-md hover:bg-customGreen-200 transition-colors duration-300 ease-in-out h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <img src={fav3} alt="Favicon" className="w-20 h-20 m-2 p-2" />
                  </div>
                  <div className="bottom-0 right-0"> 
                    <h3 className="text-right text-lg font-montserrat font-semibold">Browse Companies</h3>
                  </div>
                </div>
              </div>
            </Link>
            }

            {/* Browse Organizations */}
            {profileData && auth?.username === uid &&
            <Link to="/projects">
              <div className="bg-customGreen-100 bg-opacity-30 p-4 my-10 rounded-lg shadow-md hover:bg-customGreen-200 transition-colors duration-300 ease-in-out h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <img src={fav3} alt="Favicon" className="w-20 h-20 m-2 p-2" />
                  </div>
                  <div className="bottom-0 right-0"> 
                    <h3 className="text-right text-lg font-montserrat font-semibold">Browse Projects</h3>
                  </div>
                </div>
              </div>
            </Link>
            }
            
            {/* Update */}
            {auth?.username === uid &&           
              <div className="bg-customGreen-100 bg-opacity-30 p-4 my-10 rounded-lg shadow-md hover:bg-customGreen-200 transition-colors duration-300 ease-in-out h-full">
                <Link to="/profile/update">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <img src={fav4} alt="Favicon" className="w-20 h-20 m-2 p-1" />
                    </div>
                    <div className="bottom-0 right-0"> 
                      <h3 className="text-right text-lg font-montserrat font-semibold">Update Your Profile</h3>
                    </div>
                  </div>
                </Link>
              </div>  
            }

            {/* Change password */}
            {auth?.username === uid && (
              <>
                <div className="font-montserrat bg-customGreen-100 bg-opacity-30 p-4 my-10 hover:bg-customGreen-200 rounded-lg shadow-md transition-colors duration-300 ease-in-out h-full">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <img src={fav5} alt="Favicon" className="w-20 h-20 m-2" />
                    </div>
                    <div className="bottom-0 right-0"> 
                      <h3 className="text-right text-lg font-montserrat font-semibold">
                        <button
                          onClick={() => {
                            setShowPasswordForm(true);
                            setErrors();
                          }}
                        >
                        Update Password
                        </button>
                      </h3>
                    </div>

                    {showPasswordForm && (
                      <>
                        <UpdatePasswordForm
                          setReturnMessage={setErrors}
                          setShowForm={setShowPasswordForm}
                        />
                        <button
                          onClick={() => {
                            setShowPasswordForm(false);
                          }}
                          className="flex mb-4 w-full justify-center rounded-md bg-customGreen-200 opacity-70 px-3 py-1.5 text-sm text-customGreen-800 font-semibold leading-6 text-white shadow-sm hover:bg-customGreen-500 hover:opacity-90 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>  
              </>
            )} 
            <a href={stripeAccountURL} rel="noopener noreferrer" target="_blank">
                <div className="bg-customGreen-100 bg-opacity-30 p-4 my-10 rounded-lg shadow-md hover:bg-customGreen-200 transition-colors duration-300 ease-in-out h-full">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <img src={fav4} alt="Favicon" className="w-20 h-20 m-2 p-1" />
                    </div>
                    <div className="bottom-0 right-0">
                      <h3 className="text-right text-lg font-montserrat font-semibold">Update Payment Information</h3>
                    </div>
                  </div>
                </div>
            </a>

          </div>
          
          {auth?.isProject === false && auth?.username != uid && (
            <>
              <button
                onClick={() => {
                  setShowTransactionForm(true);
                }}
              >
                {profileData.isProject ? "Invest" : "Trade"}
              </button>
              {showTransactionForm && (
                <>
                  <InitiateTransactionForm uid={uid} isTrade={!profileData.isProject} />
                  <button onClick={() => setShowTransactionForm(false)}>Cancel</button>
                </>
              )}
            </>
          )}
          <div>
            <PendingTransactions
              numTransactionResponses={numTransactionResponses}
              setNumTransactionResponses={setNumTransactionResponses}
            />
            <TransactionHistory key={numTransactionResponses} />
          </div>    
        </main> 
      </>
      )}
    </>
  );
}





      
 
