import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { privateRoutes } from "../constants";
import { selectUserCredential } from "../features/userSlice";
import SideBar from "../components/layout/SideBar";

function AdminCheck({ children }) {
  const localUser = useSelector(selectUserCredential);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localUser && location.pathname !== "/") {
      const accessible = localUser.DatabaseAccessibility.find(
        (access) => access === true
      );
      if (accessible) {
        return;
      }
      if (privateRoutes.find((route) => location.pathname.startsWith(route))) {
        alert("You are illegal to access this page!");
        navigate("/");
      }
    }
  }, [localUser, navigate, location.pathname]);

  return (
    <>
      {localUser && <SideBar localUser={localUser} />}
      {children}
    </>
  );
}

export default AdminCheck;
