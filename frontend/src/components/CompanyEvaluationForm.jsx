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
      date: currentDate.toISOString().slice(0, 19).replace("T", " "),
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
          navigate("/evaluation-success");
        } else {
          setErrors("Error with evaluation process");
        }
      })
      .catch((error) => {
        setErrors("Error submitting evaluation. Please try again.");
      });
  };

  return (
    
    <div className="relative h-screen">
      <div className="flex justify-center items-start py-10">
        <div className="w-full max-w-md p-10 bg-white shadow-md rounded-md">
          <h1 className="text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900 mb-10 font-montserrat">Company Evaluation Form</h1>
          { errors  && 
            <div class="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
              </svg>
              <span class="sr-only">Info</span>
              <div>
                <span class="font-medium">{errors}</span>
              </div>
            </div>
          }
          <form className="font-montserrat" onSubmit={(e) => evaluateCompany(e)}>
            <div className="my-4">
              <label htmlFor="companySize">Number of Employees</label>
              <input type="number" name="companySize" min="1" required className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"/>
            </div>

            <div className="my-4">
              <label htmlFor="revenue">Revenue (USD)</label>
              <input type="number" name="revenue" min="0" required className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"/>
            </div>

            <div className="my-4">
              <label htmlFor="date">Evaluation Date</label>
              <input
                type="date"
                name="date"
                value={currentDateLocal.split("T")[0]}
                required
                disabled
                className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"
              />
            </div>

            <div className="my-4">
              <label htmlFor="emission">Emission (metric ton)</label>
              <input type="number" name="emission" min="0" required className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"/>
            </div>

            <div className="my-4">
              <label htmlFor="electricity">Electricity (kWh)</label>
              <input type="number" name="electricity" min="0" required className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"/>
            </div>

            <div className="my-4">
              <label htmlFor="naturalGas">Natural Gas (cf)</label>
              <input type="number" name="naturalGas" min="0" required className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"/>
            </div>

            <div className="my-4">
              <label htmlFor="water">Water (cubic meter)</label>
              <input type="number" name="water" min="0" required className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"/>
            </div>

            <div className="my-4">
              <label htmlFor="waste" >Total waste (kg)</label>
              <input type="number" name="waste" min="0" required className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"/>
            </div>

            <div className="my-4">
              <label htmlFor="recycled" >Recycled waste (kg)</label>
              <input type="number" name="recycled" min="0" required className="mt-2 block text-md w-full rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"/>
            </div>

            <button type="submit" className="flex w-full justify-center rounded-md mt-10 bg-gradient-to-br from-customGreen-200 via-customGreen-400 to-customGreen-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gradient-to-bl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompanyEvaluationForm;
