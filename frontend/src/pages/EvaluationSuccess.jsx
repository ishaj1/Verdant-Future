import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import fav from "../icons/green_credits.png";
function EvaluationSuccess() {
  const [greenCredit, setGreenCredit] = useState(null);
  const [targets, setTargets] = useState(null);
  const [results, setResults] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [errors, setErrors] = useState("");
  const { auth } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = auth.username;
        const response = await axios.get("/get_green_credit", {
          params: { username },
        });
        if (response.data.message === "No company found!") {
          setErrors("User Not Found");
        } else {
          setErrors();
          setGreenCredit(response.data.credits);
          setTargets(response.data.target_ratios);
          setResults(response.data.comp_ratios);
          setRatings(response.data.ratings);
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
            <span className="font-medium">Error!</span> {errors}
          </div>
        </div>
      )}
      {greenCredit && (
        <div className="bg-gray-100 h-screen flex items-center">
          <div className="bg-white p-6 h-max md:mx-auto">
            <img src={fav} className="w-20 h-20 mx-auto my-6"></img>
            <div className="text-center">
              <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                Evaluation Successful!
              </h3>
              <p className="text-gray-600 my-2 mb-5">
                Thank you for completing your evaluation.
              </p>

              <table style={{ margin: "0 auto" }}>
                <colgroup>
                  <col style={{ width: "280px" }} />
                  <col style={{ width: "100px" }} />
                  <col style={{ width: "100px" }} />
                  <col style={{ width: "100px" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th> </th>
                    <th>Result</th>
                    <th>Target Value</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style={{
                      backgroundColor:
                        results.ghg_ratio > targets.ghg_ratio
                          ? "#fef08a"
                          : "#d9f99d",
                    }}
                  >
                    <td>Emission Intensity (metric tons / capita)</td>
                    <td>
                      <span className="text-customGreen-700">
                        {results.ghg_ratio}
                      </span>
                    </td>
                    <td>
                      <span className="text-customGreen-700">
                        {targets.ghg_ratio}
                      </span>
                    </td>
                    <td>
                      <span className="text-customGreen-700">
                        {ratings.ghg_rating}
                      </span>
                    </td>
                  </tr>
                  <tr
                    style={{
                      backgroundColor:
                        results.energy_ratio > targets.energy_ratio
                          ? "#fef08a"
                          : "#d9f99d",
                    }}
                  >
                    <td>Energy Intensity (MJ / USD)</td>
                    <td>
                      <span className="text-customGreen-700">
                        {results.energy_ratio}
                      </span>
                    </td>
                    <td>
                      <span className="text-customGreen-700">
                        {targets.energy_ratio}
                      </span>
                    </td>
                    <td>
                      <span className="text-customGreen-700">
                        {ratings.energy_rating}
                      </span>
                    </td>
                  </tr>
                  <tr
                    style={{
                      backgroundColor:
                        results.water_ratio < targets.water_ratio
                          ? "#fef08a"
                          : "#d9f99d",
                    }}
                  >
                    <td>Water Efficiency (USD / cubic meter)</td>
                    <td>
                      <span className="text-customGreen-700">
                        {results.water_ratio}
                      </span>
                    </td>
                    <td>
                      <span className="text-customGreen-700">
                        {targets.water_ratio}
                      </span>
                    </td>
                    <td>
                      <span className="text-customGreen-700">
                        {ratings.water_rating}
                      </span>
                    </td>
                  </tr>
                  <tr
                    style={{
                      backgroundColor:
                        results.waste_ratio < targets.waste_ratio
                          ? "#fef08a"
                          : "#d9f99d",
                    }}
                  >
                    <td>Waste Ratio (percent recycled)</td>
                    <td>
                      <span className="text-customGreen-700">
                        {results.waste_ratio}
                      </span>
                    </td>
                    <td>
                      <span className="text-customGreen-700">
                        {targets.waste_ratio}
                      </span>
                    </td>
                    <td>
                      <span className="text-customGreen-700">
                        {ratings.waste_rating}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p style={{ color: "#365314", fontSize: "14px" }}>
                *It's recommended to aim for low emission and energy intensity
                values
              </p>
              <p
                style={{
                  color: "#365314",
                  fontSize: "14px",
                  marginBottom: "20px",
                }}
              >
                and high water efficiency and waste ratio values.
              </p>

              <p>
                Your Company's Calculated Green Credit for this evaluation is:
              </p>
              <span className="text-customGreen-700">
                {greenCredit.green_credit}
              </span>
              <p>Your Company's Total Green Credit is updated to:</p>
              <span className="text-customGreen-700">
                {greenCredit.total_credit}
              </span>
              <div className="py-12 text-center">
                <Link
                  to={`/profile/${auth?.username}`}
                  className="m-10 rounded-md bg-customGreen-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-customGreen-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  GO BACK
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EvaluationSuccess;
