import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();


export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URI;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getAuthState = async()=>{
    try {
      const {data}  = await axios.get(backendUrl + '/api/auth/isAuthenticated')
      if (data.success) {
        setIsLoggedIn(true)
        getUserData()
      }
    } catch (error) {
    }
  }

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/user-details');
      data.success
        ? setUserData(data.userData)
        : toast.error(data.message, { autoClose: 1500 });
    } catch (error) {
      toast.error(error.message, { autoClose: 1500 });
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};
