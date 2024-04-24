import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

export default function Transaction() {
  const { state } = useLocation();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState();

  const appearance = {
    theme: "stripe",
  };
  const options = {
    // clientSecret,
    mode: "payment",
    amount: state.total_cost,
    currency: "usd",
    appearance,
  };

  const submitPayment = (e) => {
    e.currentTarget.disabled = true;

    const formData = {
      amount: state.total_cost,
      source: auth.username,
      destination: state.sendToUser,
    };
    axios
      .post("http://localhost:4242/project_transfer", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((res) => {
        if (res.data.message == "Funds transferred successfully") {
          navigate("/transaction-success", { state: { details: res.data.details } });
        }
      })
      .catch((err) => {
        setMessage("Issue processing request. Please try again later.");
      });
  };

  return (
    <div className="App">
      {message && <p>{message}</p>}
      <div className="CreditInformation">
        <div>Price per credit: ${state.price / 100}</div>
        <div>Credits: {state.credits}</div>
        <div>Total Cost: ${state.total_cost / 100}</div>
      </div>
      <button onClick={submitPayment}>Confirm</button>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        Cancel
      </button>
    </div>
  );
}
