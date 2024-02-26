import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "./api/axios";

function EvaluationSuccess() {
  const [greenCredit, setGreenCredit] = useState(null);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/get_green_credit");
        if (response.data.message === "No company found!") {
          setErrors("User Not Found");
        } else {
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
    <div className="EvaluationSuccess">
      <h2>Evaluation Successful</h2>
      {errors && <p>{errors}</p>}
      {greenCredit && (
        <div>
        <p>{greenCredit.company_name}'s Green Credit: {greenCredit.green_credits}</p>
        {/* Go back to whatever page, subject to change */}
        <Link to="/">Go to Home Page</Link> 
        </div> 
      )}
    </div>
  );
}

export default EvaluationSuccess;
