import React, { useState } from "react";
import { retrieveData } from "../../services/airtable.service";
import { SpinnerCircular } from "spinners-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectError,
  selectLoading,
  setUserCredential,
  setError,
  setLoading,
} from "../../features/userSlice";
import {
  getLocalUser,
  setLocalUser,
} from "../../services/localStorage.service";
import { Navigate, useNavigate } from "react-router";
import { Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const handleInput = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === "") {
      dispatch(
        setError({
          status: true,
          type: "username",
          message: "Username cannot be blank",
        })
      );
    } else if (loginForm.password === "") {
      dispatch(
        setError({
          status: true,
          type: "password",
          message: "Password cannot be blank!",
        })
      );
    } else {
      dispatch(setLoading(true));
      retrieveData("Staff", `{Account} = "${loginForm.username}"`)
        .then((res) => {
          if (res.length === 0) {
            dispatch(
              setError({
                status: true,
                type: "username",
                message: "This user isn't existed!",
              })
            );
          } else {
            const actualPassword = res[0].fields.Password;
            if (loginForm.password === actualPassword) {
              setLocalUser({ ...res[0].fields, logInByPage: true });
              dispatch(setUserCredential(res[0].fields));
              dispatch(
                setError({
                  status: false,
                  type: "",
                  message: "",
                })
              );
              navigate("/");
            } else {
              dispatch(
                setError({
                  status: true,
                  type: "password",
                  message: "Password is incorrect!",
                })
              );
            }
          }
        })
        .catch((error) => {
          console.log("Error while login", error);
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  };

  return getLocalUser() ? (
    <Navigate to="/" />
  ) : (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-5 col-xl-4 my-5">
          <h1 className="display-4 text-center mb-3">Login</h1>
          <p className="text-muted text-center mb-5">
            Empla - Control own and others
          </p>
          <form>
            <div className="form-group">
              <label>Username or Email Address</label>
              <input
                type="email"
                autoComplete="username"
                className="form-control"
                placeholder="name@address.com"
                name="username"
                value={loginForm.username}
                onChange={handleInput}
                onFocus={() =>
                  dispatch(setError({ status: false, type: "", message: "" }))
                }
              />
              {error.status && error.type === "username" && (
                <div className="text-danger mt-1">{error.message}</div>
              )}
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col">
                  <label>Password</label>
                </div>
              </div>
              <div className="input-group input-group-merge">
                <input
                  type="password"
                  autoComplete="current-password"
                  className="form-control form-control-appended"
                  placeholder="Enter your password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleInput}
                  onFocus={() =>
                    dispatch(setError({ status: false, type: "", message: "" }))
                  }
                />
                <div className="input-group-append">
                  <span className="input-group-text">
                    <i className="fe fe-eye"></i>
                  </span>
                </div>
              </div>
              <div className="row d-flex justify-content-between align-items-center mt-2">
                <div className="col-auto">
                  {error.status && error.type === "password" && (
                    <div className="form-text text-danger">{error.message}</div>
                  )}
                </div>
                <div className="col-auto">
                  <Link
                    to="/password-reset"
                    className="form-text small text-muted"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>
            <button
              className="btn btn-lg btn-block btn-primary mb-3"
              disabled={loading}
              onClick={onSubmitLogin}
            >
              {loading ? (
                <SpinnerCircular size="20px" color="white" className="mx-2" />
              ) : (
                "Sign in"
              )}
            </button>
            <div className="text-center">
              <small className="text-muted text-center">
                Don't have an account yet?{" "}
                <a href="sign-up.html">Contract your manger</a>.
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
