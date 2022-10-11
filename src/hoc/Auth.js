import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserCredential } from "../features/userSlice";
import { useNavigate } from "react-router";
import { createNewLog } from "../features/logsSlice";
import { useToasts } from "react-toast-notifications";
import { browserDetect } from "../utils/userAgentUtils";

function Auth({ children }) {
  const dispatch = useDispatch();
  const userCredential = useSelector(selectUserCredential);
  const userAccount = useMemo(() => {
    if (!userCredential) return undefined;
    return userCredential.Account;
  }, [userCredential]);
  const navigate = useNavigate();
  const { addToast } = useToasts();

  useEffect(() => {
    if (userAccount) {
      try {
        dispatch(
          createNewLog({
            Actions: "Login",
            Account: userAccount,
            Status: "Done",
            Notes: `Browser: ${browserDetect()}`,
          })
        );
      } catch (error) {
        console.log(error);
      }
      
      addToast("Login Successfully!", { appearance: "success" });
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, [userAccount]);

  return <>{children}</>;
}

export default Auth;
