import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";

export default function TransactionHistory() {
  const { auth } = useAuth();
  const [transactions, setTransactions] = useState([]);

  const getTransactions = () => {
    axios
      .get("/get_past_transactions", { params: { username: auth.username } })
      .then((response) => {
        setTransactions(response.data);
      });
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
            <h2 className="text-center p-2 font-semibold text-lg">Transaction History</h2>
            {transactions.map((transaction, index) => (
              <div key={index}>
                <p>From: {transaction.sender_username}</p>
                <p>To: {transaction.receiver_username}</p>
                <p>Credits: {transaction.credits_transferred}</p>
                <p>Amount: ${transaction.amount_transferred}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
