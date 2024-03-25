import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import Header from "./Header";

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
          setGreenCredit(response.data);
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
      <div className="EvaluationSuccess">
        <h2>Evaluation Successful</h2>
        {errors && <p>{errors}</p>}
        {greenCredit && (
          <div>
            <p>
              Your Company's Calculated Green Credit is: {greenCredit.green_credits}
            </p>
            {/* Go back to whatever page, subject to change */}
            <Link to="/">Go to Home Page</Link>
          </div>
        )}
      </div>
    </>
  );
}

export default EvaluationSuccess;
