import React, { useContext } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/The_Algorithms_Logo.png";
import { AppContent } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { MdOutlineAlternateEmail } from "react-icons/md";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContent);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message, { autoClose: 1500 });
      } else {
        toast.error(data.message, { autoClose: 1500 });
      }
    } catch (error) {
      toast.error(error.message, { autoClose: 1500 });
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      navigate("/");
      toast.success(data.message, { autoClose: 1500 });
    } catch (error) {
      toast.error(error.message, { autoClose: 1500 });
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-10">
      <img className="rounded-full w-10 sm:w-14" src={Logo} alt="Logo" />
      {userData ? (
        <div className="cursor-pointer rounded-full border-2 border-cyan-700 bg-white text-black w-8 h-8 flex justify-center items-center relative group hover:shadow-[0_0_15px_5px_rgba(6,182,212,0.6)]">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-white rounded pt-10">
            <ul className="list-none w-fit m-0 p-1 bg-gray-900 text-sm">
              <li className="py-1 text-center bg-[#2b2b2b5c] gap-1 mb-4  px-1.5 rounded  cursor-pointer">
               {userData.name}
               <div className="flex items-center">
                <MdOutlineAlternateEmail/>
               {userData.email}
                </div>
              </li>
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-1.5 hover:bg-gray-800 rounded  cursor-pointer">
                  Verify Email
                </li>
              )}
              <li
                onClick={logout}
                className="py-1 px-1.5 hover:bg-gray-800 rounded  cursor-pointer">
                LogOut
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-4 sm:px-6 py-2 text-gray-100 hover:bg-gray-800 cursor-pointer transition-all text-sm sm:text-base"
        >
          Login <FaLongArrowAltRight />
        </button>
      )}
    </div>
  );
};

export default Navbar;
