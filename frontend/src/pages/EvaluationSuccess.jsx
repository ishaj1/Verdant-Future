import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";

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
      <div className="EvaluationSuccess">
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
      </div>
    </>
  );
}

export default EvaluationSuccess;
