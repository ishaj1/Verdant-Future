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
          "Sorry, your request could not be processed. Please try again later. You may need to update your payment information (you can do so by going to your dashboard and clicking \"Update Payment Information\")."
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
            <h2 className="text-center p-2 font-semibold text-lg">Pending Trade Requests</h2>
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


            {transactions.map((transaction, index) => (
              <div key={index} className="border-b-2 border-gray-200 py-4">
                <p><span className="font-semibold">From:</span> {transaction.sender_company_name}</p>
                <p><span className="font-semibold">To:</span> {transaction.receiver_company_name}</p>
                <p><span className="font-semibold">Credits:</span> {transaction.credits_transferred}</p>
                <p><span className="font-semibold">Amount:</span> ${(transaction.amount_transferred / 100).toFixed(2)}</p>
                {transaction.sender_username == auth.username ? (
                  <button className="mr-2 bg-customGreen-300" onClick={() => respondToTransaction(transaction.transaction_name, "cancelled")}>Cancel</button>
                ) : (
                  <>
                    <div className="mt-3 flex justify-center">
                      <button className="mr-10 p-2 bg-customGreen-200 rounded-sm hover:bg-customGreen-400" onClick={() => respondToTransaction(transaction.transaction_name, "accepted")}>Accept</button>
                      <button className="p-2 bg-customGreen-200 rounded-sm hover:bg-customGreen-400" onClick={() => respondToTransaction(transaction.transaction_name, "declined")}>Decline</button>
                    </div>
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