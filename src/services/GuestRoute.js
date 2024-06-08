import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./AuthService";
import { toast } from "react-toastify";

export const GuestRoute = ({ children }) => {
  const navigate = useNavigate(); 

  useEffect(() => {
    if (auth.getAuthStatus()) {
      toast.error("Vec ste prijavljeni");
      navigate("/");
    }
  }, [navigate]);
  return children;
};