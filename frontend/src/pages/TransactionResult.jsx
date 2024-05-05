import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import fav from "../icons/green_credits.png"

export default function TransactionResult() {
  const { auth } = useAuth();
  const { state } = useLocation();
  return (
    <>
    <div>
      <Header />
      <div className="bg-gray-100 h-screen flex items-center">
          <div className="bg-white p-6 h-4/5 md:mx-auto">
            <img src={fav} className="w-20 h-20 mx-auto my-6"></img>
            <div className="text-center">
              <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Successful!</h3>
              <p className="text-gray-600 my-2 mt-5">Thank you for supporting a green future for everyone.</p>
              <p className="text-customGreen-600 my-2 mb-5 hover:text-gray-600">
                <a href={state?.details?.receipt_url} rel="noopener noreferrer" target="_blank">
                  View Receipt
                </a>
              </p>
            </div>
            <div className="py-12 text-center">
              <Link to={`/profile/${auth?.username}`} className="m-10 rounded-md bg-customGreen-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-customGreen-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Return to Profile
              </Link>
            </div>
          </div>
      </div>
    </div>
    </>
  );
}
