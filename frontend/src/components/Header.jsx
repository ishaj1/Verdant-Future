import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import { useState } from "react";

import LoginForm from "../components/LoginForm";

export default function Header() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();
  const [loginForm, setLoginForm] = useState(false);

  const signOut = async () => {
    await logout();
    navigate("/");
  };
  return (
    <header className="flex items-center justify-between bg-customGreen-700 px-3 py-2 lg:px-12" aria-label="Main">
      <a href="/" className="text-3xl font-semibold text-white px-3 py-5 font-playfair">Verdant Future</a>
      <nav>
        <ul className="hidden gap-8 md:flex text-white font-roboto">
          <li>
            <a href="#">About us</a>
          </li>
          <li>
            <a href="#">Projects</a>
          </li>
          <li>
            <a href="#">Companies</a>
          </li>

          {auth?.username ? 
            <li>
              <button onClick={signOut}>Logout</button>
            </li>
            :
            <button
              onClick={() => {
                setLoginForm(true);
              }}
            >
              Login
            </button>
          }

          {auth?.username ? (
            <li>
              <Link to={`/profile/${auth?.username}`} className="bg-customGreen-800 px-4 py-2 rounded-xl">Dashboard</Link>
            </li>)
            :
            (<li>
            <a href="/register" className="bg-customGreen-800 px-4 py-2 rounded-xl">Sign up</a>
            </li>)
          }

        </ul>
        
        <details className="flex md:hidden">
          <summary className="bg-costomGreen-600 hover:bg-customGreen-200 [[open]>&]:bg-customGreen-200 _no-triangle grid h-10 w-10 place-items-center rounded-full cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
          </summary>

          <div className="absolute right-0 z-20 md:left-0">
            <div className="relative top-9 w-30 rounded-md border border-gray-100 bg-white p-1 shadow-sm ">
              <nav>
                <ul className="flex flex-col gap-5 px-2 py-2.5 font-abeezee text-right">
                  <li>
                    <a href="#">About us</a>
                  </li>
                  <li>
                    <a href="#">Projects</a>
                  </li>
                  <li>
                    <a href="#">Companies</a>
                  </li>

                  {auth?.username ?
                  <li>
                    <button onClick={signOut}>Logout</button>
                  </li> : <p>hi</p>}

                  {auth?.username && (
                    <li>
                      <Link to={`/profile/${auth?.username}`} className="bg-customGreen-800 px-4 py-2 rounded-xl text-white">Dashboard</Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
          
        </details>

      </nav>
      {loginForm && (
        <LoginForm loginActive={loginForm} setLoginActive={setLoginForm} />
      )}
    </header>
    
  );
}
