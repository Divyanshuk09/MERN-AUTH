import React, { useContext, useState } from "react";
import logo from "../assets/The_Algorithms_Logo.png";
import { useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { TbEyeClosed, TbLockPassword, TbEye } from "react-icons/tb";
import { AppContent } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);

  const [state, setstate] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlesubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    if (state === "Sign-Up" && password !== confirmPass) {
      setErrorMsg("Passwords do not match! Re-Type Password");
      return;
    } else {
      setErrorMsg("");
    }

    try {
      let res;

      if (state === "Sign-Up") {
        res = await axios.post(backendUrl + "/api/auth/register", {
          email,
          name,
          password,
        });
      } else {
        res = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });
      }
      const { data } = res;

      if (data.success) {
        toast.success(data.message, { autoClose: 1500 });
        setIsLoggedIn(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(error.message, { autoClose: 1500 });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to bg-purple-400">
      <img
        src={logo}
        onClick={() => navigate("/")}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-15 sm:w-18 cursor-pointer rounded-full"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign-Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign-Up"
            ? "Create Your Account"
            : "Login to your account"}
        </p>
        <form onSubmit={handlesubmit}>
          {state === "Sign-Up" ? (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <FaRegUser size={18} />
              <input
                className="outline-none bg-transparent w-full"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>
          ) : (
            ""
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <MdOutlineAlternateEmail size={20} />
            <input
              className="outline-none bg-transparent w-full"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <TbLockPassword size={25} />
            <input
              className="outline-none bg-transparent w-full"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer transition-all"
            >
              {showPassword ? <TbEye size={20} /> : <TbEyeClosed size={20} />}
            </span>
          </div>
          {state === "Sign-Up" ? (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <TbLockPassword size={25} />
              <input
                className="outline-none bg-transparent w-full"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPass}
                placeholder="Re-Enter-Password"
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="cursor-pointer transition-all"
              >
                {showConfirmPassword ? (
                  <TbEye size={20} />
                ) : (
                  <TbEyeClosed size={20} />
                )}
              </span>
            </div>
          ) : (
            " "
          )}

          {errorMsg && (
            <p className="text-red-400 mb-2 text-center font-extralight">
              {errorMsg}
            </p>
          )}
          {state === "Sign-Up" ? (
            ""
          ) : (
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 text-indigo-500 cursor-pointer"
            >
              Forgot Password ?
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-900 hover:scale-105 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-950 transition-all duration-300 ease-in-out text-white font-semibold shadow-md hover:shadow-lg cursor-pointer"
          >
            {state === "Sign-Up" ? " Create Account" : "Login "}
          </button>

          {state === "Sign-Up" ? (
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <span
                onClick={() => setstate("Login")}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Login Here
              </span>
            </p>
          ) : (
            <p className="mt-4 text-center">
              Don't have an account?{" "}
              <span
                onClick={() => setstate("Sign-Up")}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Sign up
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
