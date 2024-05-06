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
      <div className="relative h-full bg-customGreen-50 FillScreen">
        <div className="flex justify-center items-start py-10">
          <div className="font-montserrat w-full max-w-lg p-10 bg-white shadow-md rounded-md">
            <h2 className="text-center p-2 font-semibold text-lg">Transaction History</h2>
            {transactions.map((transaction, index) => (
              <div key={index} className="border-b-2 border-gray-200 py-2">
                <p className="mb-1"><span className="font-semibold">From:</span> {transaction.sender_company_name}</p>
                <p className="mb-1"><span className="font-semibold">To:</span> {transaction.receiver_company_name || transaction.receiver_project_name}</p>
                <p className="mb-1"><span className="font-semibold">Credits:</span> {transaction.credits_transferred}</p>
                <p className="mb-1"><span className="font-semibold">Amount:</span> ${transaction.amount_transferred}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
