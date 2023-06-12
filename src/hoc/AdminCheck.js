import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { privateRoutes } from "../constants";
import { selectUserInfo } from "../features/userSlice";
import SideBar from "../components/layout/SideBar";

function AdminCheck({ children }) {
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userInfo && location.pathname !== "/") {
      const accessible = userInfo?.fields.DatabaseAccessibility.find(
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
  }, [userInfo, navigate, location.pathname]);

  return (
    <>
      {userInfo && <SideBar />}
      {children}
    </>
  );
}

export default AdminCheck;
