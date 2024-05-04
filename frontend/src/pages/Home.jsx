import { useState } from "react";

import LoginForm from "../components/LoginForm";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import fav from "../icons/home.png";

export default function HomePage() {
  const [loginForm, setLoginForm] = useState(false);

  return (
    <>
      <Header />
      <div className="relative h-screen bg-customGreen-50">
        <div className="grid h-full max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28"> 
          <div class="mr-auto place-self-center lg:col-span-7">
            <h1 class="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">Building a Verdant Future <br/>for our planet.</h1>
            <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Get your company evaluated or get funds for your green project by <Link to="/register" class="hover:underline">signing up</Link>.</p>
          </div>
          <div className="m-2 lg:mt-0 lg:col-span-5 lg:flex">
            <img src={fav}  />
          </div>
        </div>
      </div>
    </>
  );
}
