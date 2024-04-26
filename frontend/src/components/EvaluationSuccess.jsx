import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import Header from "./Header";
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
      {errors && <p>{errors}</p>}
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
      {/* <div className="EvaluationSuccess">
        <h2>Evaluation Successful!</h2>
        {errors && <p>{errors}</p>}
        {greenCredit && (
          <div>
            <p>
              Your Company's Calculated Green Credit for this evaluation is: {greenCredit.green_credit}
            </p>
            <p>
              Your Company's Total Green Credit is updated to: {greenCredit.total_credit}
            </p>
            
            <Link to={`/profile/${auth?.username}`}>Back to Profile</Link>
          </div>
        )}
      </div> */}
    </>
  );
}

export default EvaluationSuccess;
