import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserCredential } from "../features/userSlice";
import { getLocalUser } from "../services/localStorage.service";
import { useNavigate } from "react-router";

function Auth({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const localUser = getLocalUser();

  useEffect(() => {
    dispatch(setUserCredential(localUser));
    if (localUser === null) {
      navigate("/login");
    }
  }, [localUser, navigate, dispatch]);

  return <>{children}</>;
}

export default Auth;
