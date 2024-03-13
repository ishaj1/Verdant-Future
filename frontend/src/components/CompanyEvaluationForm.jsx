import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function CompanyEvaluationForm() {
  const currentDate = new Date();
  const offset = currentDate.getTimezoneOffset() * 60000; // Get offset in milliseconds
  const currentDateLocal = new Date(currentDate - offset).toISOString();

  const [errors, setErrors] = useState("");

  const navigate = useNavigate();

  const { auth } = useAuth();

  const evaluateCompany = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const companySize = form.companySize.value;
    const revenue = form.revenue.value;
    const emission = form.emission.value;
    const electricity = form.electricity.value;
    const naturalGas = form.naturalGas.value;
    const water = form.water.value;
    const waste = form.waste.value;
    const recycled = form.recycled.value;

    const evaluationData = {
      username: auth.username,
      company_size: companySize,
      revenue: revenue,
      date: currentDateLocal,
      emission: emission,
      electricity: electricity,
      natural_gas: naturalGas,
      water: water,
      waste: waste,
      recycled: recycled,
    };

    axios
      .post("/get_evaluated", evaluationData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((response) => {
        if (response.data.evaluate == true) {
          navigate("/EvaluationSuccess");
        } else {
          setErrors("Error with evaluation process");
        }
      })
      .catch((error) => {
        setErrors("Error submitting evaluation. Please try again.");
      });
  };

  return (
    <div className="EvaluationPage">
      <h2>Company Evaluation Form</h2>
      <p>{errors}</p>
      <form className="EvaluationForm" onSubmit={(e) => evaluateCompany(e)}>
        <div>
          <label htmlFor="companySize">Number of Employees:</label>
          <input type="number" name="companySize" min="1" required />
        </div>

        <div>
          <label htmlFor="revenue">Revenue (USD):</label>
          <input type="number" name="revenue" min="0" required />
        </div>

        <div>
          <label htmlFor="date">Evaluation Date:</label>
          <input
            type="date"
            name="date"
            value={currentDateLocal.split("T")[0]}
            required
            disabled
          />
        </div>

        <div>
          <label htmlFor="emission">Emission (metric ton):</label>
          <input type="number" name="emission" min="0" required />
        </div>

        <div>
          <label htmlFor="electricity">Electricity (kWh):</label>
          <input type="number" name="electricity" min="0" required />
        </div>

        <div>
          <label htmlFor="naturalGas">Natural Gas (cf):</label>
          <input type="number" name="naturalGas" min="0" required />
        </div>

        <div>
          <label htmlFor="water">Water (cubic meter):</label>
          <input type="number" name="water" min="0" required />
        </div>

        <div>
          <label htmlFor="waste">Total waste (kg):</label>
          <input type="number" name="waste" min="0" required />
        </div>

        <div>
          <label htmlFor="recycled">Recycled waste (kg):</label>
          <input type="number" name="recycled" min="0" required />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CompanyEvaluationForm;
