import React, { useContext } from "react";
import Robo from "../assets/Welcome.png";
import { Link } from "react-router-dom";
import { AppContent } from "../Context/AppContext";

const Header = () => {
  const { userData } = useContext(AppContent);
  return (
    <div className="flex flex-col justify-center items-center mx-auto w-full px-4 sm:px-6 lg:px-8 mt-16 gap-3 text-center">
      <Link to={"/"}>
        <img className="w-40 sm:w-52 md:w-60" src={Robo} alt="Welcome Robot" />
      </Link>
      <div className="text-xl sm:text-2xl">
        Hey {userData ? userData.name : "Developer"} 👋
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
        Welcome to our App
      </h1>
      <p className="text-base sm:text-lg md:text-xl">
        Let's get started with our application
      </p>
      <Link to="/login">
        <button
          disabled={userData && userData.name}
          className={`text-sm sm:text-base md:text-lg flex items-center gap-2 mt-4 border border-gray-500 rounded-full px-5 sm:px-6 py-2 text-gray-100  cursor-pointer transition-all
          ${
            userData && userData.name
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "hover:bg-gray-800 cursor-pointer"
          }`}
        >
          Get Started
        </button>
      </Link>
    </div>
  );
};

export default Header;
