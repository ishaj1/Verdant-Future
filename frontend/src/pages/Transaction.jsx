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
      <div className="App">
        {message && <p>{message}</p>}
        <form className="InitiateTransactionForm" onSubmit={(e) => submitTransaction(e)}>
          <label htmlFor="numCredits">Credits</label>
          <input
            type="number"
            min={1}
            step={1}
            defaultValue={numCredits}
            name="numCredits"
            id="numCredits"
            onChange={updateCredits}
            required
          />
          <p>Total Cost: ${totalCost/100}</p>

          <button type="submit" name="submit">Submit</button>
        </form>
        <button onClick={() => navigate(-1)}>Cancel</button>
      </div>
    </>
  );
}
