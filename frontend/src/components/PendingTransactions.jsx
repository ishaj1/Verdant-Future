import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

export default function PendingTransactions({
  numTransactionResponses,
  setNumTransactionResponses,
}) {
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
          "Sorry, your request could not be processed. Please try again later. You may need to update your payment information (you can do so by going to your dashboard and clicking \"Update Payment Information\")."
        );
      });
    setNumTransactionResponses(numTransactionResponses + 1);
    getTransactions();
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <div>
      <h2>Pending Offers</h2>
      {message && <div>{message}</div>}
      {transactions.map((transaction, index) => (
        <div key={index}>
          <p>From: {transaction.sender_username}</p>
          <p>To: {transaction.receiver_username}</p>
          <p>Credits: {transaction.credits_transferred}</p>
          <p>Amount: ${transaction.amount_transferred}</p>
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
  );
}
