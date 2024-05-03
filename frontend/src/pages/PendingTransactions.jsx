import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";

export default function PendingTransactions({}) {
  const { auth } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState();

  const getTransactions = () => {
    axios
      .get("/get_pending_transactions", { params: { username: auth.username } })
      .then((response) => {
        setTransactions(response.data);
      });
  };

  const respondToTransaction = (transaction_name, action) => {
    setMessage();
    axios
      .post(
        "/company_response",
        { transaction_name, action },
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      )
      .then((response) => {
        if (response.data.success == false) {
          if (action == "cancelled") {
            setMessage(
              "Sorry, your offer could not be cancelled. The offer may have already been accepted or declined. Please try again later."
            );
          } else if (action == "accepted" || action == "declined") {
            setMessage(
              "Sorry, your request could not be processed. The offer may have already been canceled. Please try again later."
            );
          }
        } else {
          setMessage();
        }
      })
      .catch((error) => {
        setMessage(
          "Sorry, your request could not be processed. Please try again later."
        );
      });
    getTransactions();
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <>
      <Header />
      <div className="relative h-screen bg-customGreen-50">
        <div className="flex justify-center items-start py-10">
          <div className="font-montserrat w-full max-w-lg p-10 bg-white shadow-md rounded-md">
            <h2 className="text-center p-2 font-semibold text-lg">Pending Offers</h2>
            {message && <div>{message}</div>}
            {transactions.map((transaction, index) => (
              <div key={index}>
                <p>From: {transaction.sender_username}</p>
                <p>To: {transaction.receiver_username}</p>
                <p>Credits: {transaction.credits_transferred}</p>
                <p>Amount: ${(transaction.amount_transferred / 100).toFixed(2)}</p>
                {transaction.sender_username == auth.username ? (
                  <button
                    onClick={() => {
                      respondToTransaction(transaction.transaction_name, "cancelled");
                    }}
                  >
                    Cancel
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        respondToTransaction(transaction.transaction_name, "accepted");
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        respondToTransaction(transaction.transaction_name, "declined");
                      }}
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
