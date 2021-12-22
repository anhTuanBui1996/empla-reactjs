import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserCredential } from "../features/userSlice";
import { getLocalUser } from "../services/localStorage.service";
import SideBar from "../components/layout/SideBar";
import { useNavigate } from "react-router";

function Auth({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const localUser = getLocalUser();
  dispatch(setUserCredential(localUser));

  useEffect(() => {
    if (localUser === null) {
      navigate("/login");
    }
  } ,[localUser, navigate]);

  return (
    <>
      {localUser && <SideBar />}
      {children}
    </>
  );
}

export default Auth;
