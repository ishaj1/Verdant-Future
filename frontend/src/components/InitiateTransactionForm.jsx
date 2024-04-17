import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InitiateTransactionForm({ uid }) {
  const navigate = useNavigate();
  const [numCredits, setNumCredits] = useState(1);
  const [totalCost, setTotalCost] = useState(1000 * 100);
  const price = 1000 * 100; // price per credit in cents

  const updateCredits = (e) => {
    const updateNumCredits = e.currentTarget.value;
    setNumCredits(updateNumCredits);
    setTotalCost(updateNumCredits * price);
  };
  const initiateTransaction = (e) => {
    e.preventDefault();
    navigate("/transaction", {
      state: { sendToUser: uid, price, total_cost: totalCost, credits: numCredits },
    });
  };

  return (
    <form className="InitiateTransactionForm" onSubmit={(e) => initiateTransaction(e)}>
      <label htmlFor="numCredits">Credits</label>
      <input
        type="number"
        min={1}
        step={1}
        defaultValue={numCredits}
        name="numCredits"
        onChange={updateCredits}
        required
      />
      <p>Total Cost: ${totalCost / 100}</p>

      <button type="submit">Continue</button>
    </form>
  );
}
