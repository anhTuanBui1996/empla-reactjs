import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewLoginToken,
  retrieveUserInfo,
  retrieveUserInfoWithToken,
  selectError,
  selectIsLoginValid,
  selectIsTokenValid,
  selectLoading,
  selectNewToken,
  selectUserCredential,
  selectUserInfo,
  setLastRoute,
} from "../features/userSlice";
import { useLocation, useNavigate } from "react-router";
import { createNewLog } from "../features/tables/logsSlice";
import { useToasts } from "react-toast-notifications";
import { browserDetect } from "../utils/userAgentUtils";
import Loader from "../components/common/Loader";
import { setLocalUser } from "../services/localStorage.service";
import { retrieveAllData } from "../services/airtable.service";

function Auth({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();

  const userCredential = useSelector(selectUserCredential);
  const userInfo = useSelector(selectUserInfo);
  const loading = useSelector(selectLoading);
  const isTokenValid = useSelector(selectIsTokenValid);
  const isLoginValid = useSelector(selectIsLoginValid);
  const newToken = useSelector(selectNewToken);
  const userError = useSelector(selectError);

  const [isRetrievedUserInfoAlready, setIsRetrievedUserInfoAlready] =
    useState(false);
  const [isRequestCreateNewTokenAlready, setIsRequestCreateNewTokenAlready] =
    useState(false);
  useEffect(() => {
    if (userError.status) {
      console.log(userError.message);
    }
  }, [userError]);
  useEffect(() => {
    if (userCredential || isLoginValid) {
      if (userInfo) {
        if (newToken) {
          // Login with login page (create new token already)
          addToast("Login successfully!", { appearance: "success" });
          setLocalUser({
            Account: userInfo.fields.Account,
            Token: newToken,
          });
          dispatch(
            createNewLog({
              Actions: "Login",
              Account: userInfo.fields.Account,
              RecordAffected: userInfo.id,
              IdAffected: userInfo.fields.StaffId,
              TableAffected: "Staff",
              Notes: `Browser: ${browserDetect()}, login with new token ${newToken}`,
            })
          );
          navigate(location.pathname === "/login" ? "/" : location.pathname);
        } else {
          // Login with login page (but not create a new token yet)
          // This step is creating a new token
          if (!isRequestCreateNewTokenAlready) {
            dispatch(
              createNewLoginToken({
                Staff: [userInfo.id],
              })
            );
            setIsRequestCreateNewTokenAlready(true);
          }
        }
      } else {
        if (isRetrievedUserInfoAlready) {
          // The user info is retrieved successfully
          if (!isTokenValid) {
            if (!loading) {
              // The token retrieved from userCredential is invalid
              addToast("Login failed, please try again!", {
                appearance: "error",
              });
              location.pathname !== "/login" &&
                dispatch(setLastRoute(location.pathname));
              navigate("/login");
            }
          } else {
            // The token retrieved from userCredential is valid
            // Retrieving the user info by account
            dispatch(retrieveUserInfo(userCredential.Account));
            retrieveAllData("Staff", `{Account} = "${userCredential.Account}"`)
              .then((res) => {
                const currentUserInfo = res[0];
                dispatch(
                  createNewLog({
                    Actions: "Login",
                    Account: currentUserInfo.fields.Account,
                    RecordAffected: currentUserInfo.id,
                    IdAffected: currentUserInfo.fields.StaffId,
                    TableAffected: "Staff",
                    Notes: `Browser: ${browserDetect()}, login with token ${
                      userCredential.Token
                    }`,
                  })
                );
                addToast("Login successfully!", {
                  appearance: "success",
                });
                navigate(
                  location.pathname === "/login" ? "/" : location.pathname
                );
              })
              .catch(() => {
                addToast("Unknown error, please try again!", {
                  appearance: "error",
                });
              });
          }
        } else {
          // Retrieving user info by token
          const { Account, Token } = userCredential;
          dispatch(
            retrieveUserInfoWithToken({ account: Account, token: Token })
          );
          setIsRetrievedUserInfoAlready(true);
        }
      }
    } else {
      dispatch(setLastRoute(location.pathname));
      setIsRetrievedUserInfoAlready(true);
      navigate("/login");
    }
    return () => {

    }
    // eslint-disable-next-line
  }, [
    userCredential,
    isTokenValid,
    isLoginValid,
    isRetrievedUserInfoAlready,
    loading,
    newToken,
  ]);

  return isRetrievedUserInfoAlready ? <>{children}</> : <Loader />;
}

export default Auth;
