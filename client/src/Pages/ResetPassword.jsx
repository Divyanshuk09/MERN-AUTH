import React, { useContext, useRef, useState } from "react";
import logo from "../assets/The_Algorithms_Logo.png";
import { useNavigate } from "react-router-dom";
import { MdOutlineAlternateEmail } from "react-icons/md";
import {
  TbEyeClosed,
  TbLockPassword,
  TbEye,
  TbClipboardCheck,
} from "react-icons/tb";
import { AppContent } from "../Context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import Countdown from "react-countdown";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials=true

  //value ko store karane ke liye
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState(0);

  //icon change karne ke liye
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //time wala message ke liye
  const [otpsendmessage, setOtpsendMessage] = useState("");
  const [countdownTime, setCountdownTime] = useState(null);

  //to change pages
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);


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

  async function onSubmitEmail(e){
    e.preventDefault();

    const {data}= await axios.post(backendUrl+'/api/auth/send-reset-otp',{email})
    
    if (data.success) {
      toast.success(data.message,{autoClose:1500});
      setIsEmailSent(true)
      setOtpsendMessage(data.message)
    }else(
      setOtpsendMessage(data.message),
      toast.error(data.message,{autoClose:1500})
    )
  }
  async function onResendOtp(){

    const {data}= await axios.post(backendUrl+'/api/auth/send-reset-otp',{email})
    if (data.success) {
      toast.success(data.message,{autoClose:1500});
      setIsEmailSent(true)
      setOtpsendMessage(data.message)
    }else(
      setOtpsendMessage(data.message),
      toast.error(data.message,{autoClose:1500})
    )
  }
  async function onOtpSubmit(e) {
    e.preventDefault();
    
    const otpArray = inputRefs.current.map((e) => e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmitted(true)
  }

  async function onNewPasSubmit(e) {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl+'/api/auth/reset-password',{email,otp,newPassword})
      if (data.success) {
        navigate('/')
        toast.success(data.message,{autoClose:1500})
      }
      else{
        navigate('/reset-password')
        toast.error(data.message,{autoClose:1500})
      }

   } catch (error) {
    toast.error(error.message,{autoClose:1500})
   }
  }

  return (
    <div className="flex items-center justify-center gap-5 min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={logo}
        onClick={() => navigate("/")}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-12 sm:w-16 cursor-pointer rounded-full"
      />

      {/* Otp send box */}
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className="bg-slate-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md text-sm text-center">
          <h2 className="text-3xl font-semibold text-white text-center mb-3">
            Reset Password
          </h2>
          <p className="text-center text-sm mb-6">
            Enter your registered email address.
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <MdOutlineAlternateEmail size={20} />
            <input
              className="outline-none bg-transparent w-full"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              disabled={countdownTime !== null}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-900 hover:scale-105 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-950">
         Submit </button>
         
         <p className="mt-4">{otpsendmessage}</p>
        </form>
      )}

      {/* OTP verification box */}

      {!isOtpSubmitted && isEmailSent && (
        <form onSubmit={onOtpSubmit} className="bg-slate-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md text-sm text-center">
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
            <p onClick={onResendOtp} className="text-blue-500 text-right hover:underline cursor-pointer">
              Resend Otp
            </p>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-900 
          hover:scale-105 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-950 
          transition-all duration-300 ease-in-out text-white font-semibold shadow-md hover:shadow-lg">
            Submit
          </button>
          <p className="mt-4">{otpsendmessage}</p>
        </form>
      )}

      {/* Reset Password BOX */}

      {isOtpSubmitted && isEmailSent && (
        <form onSubmit={onNewPasSubmit}  className="bg-slate-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md text-sm text-center">
          <h2 className="text-3xl font-semibold text-white text-center mb-3">
            New Password
          </h2>
          <p className="text-center text-sm mb-6">Enter the new password.</p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] transition-all">
            <TbLockPassword size={20} />
            <input
              className="outline-none bg-transparent w-full"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <span
              className="cursor-pointer "
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <TbEye /> : <TbEyeClosed />}
            </span>
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <TbLockPassword size={20} />
            <input
              className="outline-none bg-transparent w-full"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPass}
              placeholder="Re-Enter-Password"
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
            <span
              className="cursor-pointer "
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <TbEye /> : <TbEyeClosed />}
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-900 hover:scale-105 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-950"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
