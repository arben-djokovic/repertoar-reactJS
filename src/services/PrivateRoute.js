import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./AuthService";
import { toast } from "react-toastify";

export const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.getAuthStatus()) {
      toast.error("Neautorizovanim korisisnicima nije dozvoljen pristup");
      navigate("/log-in");
    }
  }, [navigate]);
  return children;
};