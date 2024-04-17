// import React, { useState, useEffect } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";

// import CheckoutForm from "../components/CheckoutForm";

// // stripe publishable API key
// const stripePromise = loadStripe(
//   "pk_test_51Oe5AZKlgwtgt0eBV0imAdORghf8yPgLh9waSRIJObsxWKuxjBJmD5BmLMy6FV9pfzclVktrXSF6rwY0dbuDFSVc003mVdnO3P"
// );

// export default function Transaction() {
//   const [clientSecret, setClientSecret] = useState("");

//   useEffect(() => {
//     // Create PaymentIntent as soon as the page loads
//     fetch("http://localhost:4242/create-payment-intent", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
//     })
//       .then((res) => res.json())
//       .then((data) => setClientSecret(data.clientSecret));
//   }, []);

//   const appearance = {
//     theme: "stripe",
//   };
//   const options = {
//     clientSecret,
//     appearance,
//   };

//   return (
//     <div className="App">
//       {clientSecret && (
//         <Elements options={options} stripe={stripePromise}>
//           <CheckoutForm />
//         </Elements>
//       )}
//     </div>
//   );
// }

import React, { useState } from "react";


export default function TransferFunds() {
  const [amount, setAmount] = useState('');
  // const [fromAccountID, setFromAccountID] = useState('');
  // const [toAccountID, setToAccountID] = useState('');
  const [message, setMessage] = useState('');

  const handleTransfer = async () => {
    try {
      const response = await fetch('http://localhost:5000/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          // from_account_id: fromAccountID,
          // to_account_id: toAccountID
        })
      });

      if (!response.ok) {
        throw new Error('Failed to transfer funds: Server returned ' + response.status);
      }

      const data = await response.json();

      // Check if response contains valid data
      if (!data || typeof data !== 'object') {
        throw new Error('Failed to transfer funds: Unexpected response format');
      }
      
      setMessage(data.message);
    } catch (error) {
      console.error('Error transferring funds:', error);
    }
  };

  return (
    <div>
      <h2>Transfer Funds</h2>
      <label>
        Amount:
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </label>
      <br />
      <button onClick={handleTransfer}>Transfer</button>
      {message && <p>{message}</p>}
    </div>
  );
}


// import React, { useState } from "react";
// import axios from "axios";

// export default function Transaction() {
//   const [amount, setAmount] = useState("");
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleTransfer = async () => {
//     setIsLoading(true);

//     try {
//       const response = await axios.post("http://localhost:5000/transfer", {
//         amount: amount
//       });

//       setMessage(response.data.message);
//     } catch (error) {
//       console.error("Error transferring funds:", error);
//       setMessage("An error occurred while transferring funds.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="App">
//       <h2>Transfer Funds</h2>
//       <label>
//         Amount:
//         <input
//           type="number"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//         />
//       </label>
//       <br />
//       <button onClick={handleTransfer} disabled={isLoading}>
//         {isLoading ? "Transferring..." : "Transfer"}
//       </button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }
