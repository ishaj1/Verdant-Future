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
      <div>
        <h2>Transaction History</h2>
        {transactions.map((transaction, index) => (
          <div key={index}>
            <p>From: {transaction.sender_username}</p>
            <p>To: {transaction.receiver_username}</p>
            <p>Credits: {transaction.credits_transferred}</p>
            <p>Amount: ${transaction.amount_transferred}</p>
          </div>
        ))}
      </div>
    </>
  );
}
