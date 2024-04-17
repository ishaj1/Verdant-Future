import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function TransactionResult() {
  const { auth } = useAuth();
  const { state } = useLocation();
  return (
    <div>
      <h1>Payment Successful</h1>
      <p>
        <a href={state?.details?.receipt_url} rel="noopener noreferrer" target="_blank">
          Receipt
        </a>
      </p>
      <Link to={`/profile/${auth.username}`}>Return to Profile</Link>
    </div>
  );
}
