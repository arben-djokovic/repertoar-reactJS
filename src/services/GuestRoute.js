import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./AuthService";
import { toast } from "react-toastify";

export const GuestRoute = ({ children }) => {
  let navigate = useNavigate();

  useEffect(() => {
    if (auth.getAuthStatus()) {
      toast.error("Vec ste prijavljeni");
      navigate("/");
    }
  }, []);
  return children;
};