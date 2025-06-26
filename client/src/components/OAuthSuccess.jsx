import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const OAuthSuccess = () => {
  const { setUser, setShowUserLogin, user, axios, toast, fetchUser, navigate } =
    useAppContext();
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    if (!token) {
      toast.error("No token found");
      setShowUserLogin(true);
      return;
    }
    if (token) {
      fetchUser();
      toast.success("Logged in with Google");
      navigate("/");
    } else {
      toast.error("Google login failed");
      setShowUserLogin(true);
    }
  }, []);

  return null;
};

export default OAuthSuccess;
