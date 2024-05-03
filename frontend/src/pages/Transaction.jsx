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

  const submitTransaction = (e) => {
    e.currentTarget.disabled = true;

    const formData = {
      amount: state.total_cost,
      source: auth.username,
      destination: state.sendToUser,
    };
    axios
      .post(
        state?.isTrade
          ? "http://localhost:4242/company_transfer"
          : "http://localhost:4242/project_transfer",
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
        } else {
          setMessage(res.data.message)
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
        <div>Price per credit: ${(state.price / 100).toFixed(2)}</div>
        <div>Credits: {state.credits}</div>
        <div>Total Cost: ${(state.total_cost / 100).toFixed(2)}</div>
      </div>
      <button onClick={submitTransaction}>Confirm</button>
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
