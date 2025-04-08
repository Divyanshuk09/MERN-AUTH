import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/The_Algorithms_Logo.png";
import { toast } from "react-toastify";
import { AppContent } from "../Context/AppContext";
import axios from "axios";
const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContent);
  const navigate = useNavigate();

  // Ref to hold all 6 OTP input boxes
  const inputRefs = useRef([]);

  // Handle typing in an input
  const handleInput = (e, index) => {
    // Move focus to next input if something is typed and it's not the last input
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace key press to move back
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");

      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      );
      if (data.success) {
        toast.success(data.message, { autoClose: 1500 });
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message, { autoClose: 1500 });
      }
    } catch (error) {
      toast.error(error.message, { autoClose: 1500 });
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );

      if (data.success) {
        toast.success(data.message, { autoClose: 1500 });
      } else {
        toast.error(data.message, { autoClose: 1500 });
      }
    } catch (error) {
      toast.error(error.message, { autoClose: 1500 });
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      {/* Logo click -> go to home */}
      <img
        src={logo}
        onClick={() => navigate("/")}
        alt="logo"
        className="absolute left-4 sm:left-20 top-5 w-12 sm:w-16 cursor-pointer rounded-full"
      />

      {/* OTP verification box */}
      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md text-sm text-center"
      >
        <h1 className="text-white text-2xl font-semibold mb-4">
          Email verify OTP
        </h1>

        <p className="text-[15px] mb-6 text-indigo-300">
          Enter the 6-digit code you received on your email id.
        </p>

        {/* OTP inputs - 6 boxes */}
        <div className="flex flex-col gap-0 mb-4 ">
          <div
            className="flex justify-between gap-2 sm:gap-3 mb-2"
            onPaste={handlePaste}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  required
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="rounded-lg w-8 sm:w-12 h-8 sm:h-12 bg-[#333A5C] text-white text-center text-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              ))}
          </div>
          <p
            onClick={sendVerificationOtp}
            className="text-blue-500 text-right hover:underline cursor-pointer"
          >
            Resend Otp
          </p>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-900 
          hover:scale-105 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-950 
          transition-all duration-300 ease-in-out text-white font-semibold shadow-md hover:shadow-lg"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
