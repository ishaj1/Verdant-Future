import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import Header from "../components/Header";

export default function Transaction() {
  const price = 1000 * 100; // price per credit in cents
  const { state } = useLocation();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [numCredits, setNumCredits] = useState(1);
  const [totalCost, setTotalCost] = useState(price * numCredits);

  const updateCredits = (e) => {
    const updateNumCredits = e.currentTarget.value;
    setNumCredits(updateNumCredits);
    setTotalCost(updateNumCredits * price);
  };

  const submitTransaction = (e) => {
    e.preventDefault();
    setMessage("")
    const button = e.target.elements.submit;
    button.disabled = true;

    const formData = {
      amount: totalCost,
      source: auth.username,
      destination: state.sendToUser,
    };
    axios
      .post(
        state?.isTrade
          ? "/company_transfer"
          : "/project_transfer",
        formData,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      )
      .then((res) => {
        if (res?.data?.success == true) {
          navigate("/transaction-success", { state: { details: res.data.details } });
        } else if (res?.data?.create == true) {
          navigate(`/profile/${auth.username}`);
        }
      })
      .catch((err) => {
        setMessage("Issue processing request. Please try again later.");
        button.disabled = false;
      });
  };

  return (
    <>
      <Header />
      <div className="relative h-screen bg-customGreen-50">
        <div className="flex justify-center items-start py-10">
          <div className="font-montserrat w-full max-w-lg p-10 bg-white shadow-md rounded-md">
            <div className="App">
              <h2 className="text-center p-2 font-semibold text-lg">Transaction Detail</h2>
              { message  && 
              <div class="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <span class="sr-only">Info</span>
                <div>
                  <span class="font-medium">{message}</span>
                </div>
              </div>
              }
              
              <form className="InitiateTransactionForm" onSubmit={(e) => submitTransaction(e)}>
                <div className="my-4">
                  <label htmlFor="numCredits" className="mr-4">Credits</label>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    defaultValue={numCredits}
                    name="numCredits"
                    id="numCredits"
                    onChange={updateCredits}
                    required
                    className="mt-2 text-md w-1/4 rounded-md border-0 px-3 py-2 shadow-sm ring-1 ring-inset ring-customGreen-300 focus:ring-5 focus:ring-inset focus:ring-customGreen-600 focus:outline-1 focus:outline-customGreen-400 focus:shadow-md sm:text-sm sm:leading-6"
                  />
                </div>
                <p><strong>Total Cost</strong>: ${totalCost/100}</p>

                <button type="submit" name="submit" className="flex w-full justify-center rounded-md my-5 bg-gradient-to-br from-customGreen-200 via-customGreen-400 to-customGreen-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gradient-to-bl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Submit
                  </button>
              </form>
              <button onClick={() => navigate(-1)} className="flex w-full justify-center rounded-md mt-4 bg-gradient-to-br bg-customGreen-200 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-customGreen-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Cancel
                </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
