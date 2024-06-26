import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./AuthService";
import { toast } from "react-toastify";

export const AdminRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.getAuthAdminStatus()) {
      toast.error("nisi admin");
      navigate("/");
    }
  }, [navigate]);
  return children;
};