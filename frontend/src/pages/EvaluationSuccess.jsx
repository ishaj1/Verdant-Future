import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import fav from "../icons/green_credits.png"
function EvaluationSuccess() {
  const [greenCredit, setGreenCredit] = useState(null);
  const [errors, setErrors] = useState("");
  const { auth } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = auth.username;
        const response = await axios.get("/get_green_credit", { params: { username } });
        if (response.data.message === "No company found!") {
          setErrors("User Not Found");
        } else {
          setErrors();
          setGreenCredit(response.data.credits);
        }
      } catch (error) {
        setErrors("Error fetching green credit. Please try again.");
        console.error("Error while fetching green credit:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      {errors && 
        <div class="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span class="sr-only">Info</span>
          <div>
            <span class="font-medium">Error!</span> {errors}
          </div>
        </div>
      }
      {greenCredit &&
        <div class="bg-gray-100 h-screen flex items-center">
          <div class="bg-white p-6 md:mx-auto">
            <img src={fav} className="w-20 h-20 mx-auto my-6"></img>
            <div class="text-center">
                <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">Evaluation Successful!</h3>
                <p class="text-gray-600 my-2 mb-5">Thank you for completing your evaluation.</p>
                <p>
                Your Company's Calculated Green Credit for this evaluation is: 
                </p>
                <span className="text-customGreen-700">{greenCredit.green_credit}</span>
                <p>
                  Your Company's Total Green Credit is updated to: 
                </p>
                <span className="text-customGreen-700">{greenCredit.total_credit}</span>
                <div class="py-12 text-center">
                    <Link to={`/profile/${auth?.username}`} className="m-10 rounded-md bg-customGreen-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-customGreen-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        GO BACK 
                    </Link>
                </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default EvaluationSuccess;
