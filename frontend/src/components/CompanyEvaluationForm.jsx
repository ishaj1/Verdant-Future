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
    const form = e.currentTarget.elements;
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
        console.log("response: ", response)
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
    
    <div className="relative h-full bg-customGreen-50">
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

            <div class="relative mb-5">
              <input type="number" name="companySize" id="companySize" min="1" required class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" " />
              <label htmlFor="companySize" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Number of Employees</label>
              </div>

            <div className="relative my-4">
              <input type="number" name="revenue" id="revenue" min="0" required class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" "/>
              <label htmlFor="revenue" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Revenue (USD)</label>
            </div>


            <div className="relative my-4">
              <input type="number" name="emission" id="emission" min="0" required class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" "/>
              <label htmlFor="emission" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Emission (metric ton)</label>  
            </div>

            <div className="relative my-4">
              <input type="number" name="electricity" id="electricity" min="0" required class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" "/>
              <label htmlFor="electricity" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Electricity (kWh)</label>
            </div>

            <div className="relative my-4">
              <input type="number" name="naturalGas" id="naturalGas" min="0" required class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" "/>
              <label htmlFor="naturalGas" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Natural Gas (cf)</label>
            </div>

            <div className="relative my-4">
              <input type="number" name="water" id="water" min="0" required class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" "/>
              <label htmlFor="water" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Water (cubic meter)</label>
            </div>

            <div className="relative my-4">
              <input type="number" name="waste" id="waste" min="0" required class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" "/>
              <label htmlFor="waste" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Total waste (kg)</label>
            </div>

            <div className="relative my-4">
              <input type="number" name="recycled" id="recycled" min="0" required class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 bg-opacity-40 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-customGreen-500 focus:outline-none focus:ring-0 focus:border-customGreen-600 peer" placeholder=" "/>
              <label htmlFor="recycled" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-customGreen-600 peer-focus:dark:text-customGreen-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Recycled waste (kg)</label>
            </div>

            <button type="submit" className="flex w-full justify-center rounded-md mt-10 bg-gradient-to-br from-customGreen-200 via-customGreen-400 to-customGreen-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gradient-to-bl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompanyEvaluationForm;
