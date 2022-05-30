import React, { useState } from "react";
import styled from "styled-components";
import {
  MdLogout,
  MdNotifications,
  MdOutlineChecklist,
  MdSettings,
  MdSupervisorAccount,
} from "react-icons/md";
import { IconContext } from "react-icons";
import { Link, NavLink } from "react-router-dom";
import { privateRoutes, SIDENAV } from "../../constants";
import { removeLocalUser } from "../../services/localStorage.service";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserCredential,
  setUserCredential,
} from "../../features/userSlice";
import PropTypes from "prop-types";
import Search from "../common/Search";
import { selectInnerWidth } from "../../features/windowSlice";
import Outclick from "../../hoc/Outclick";
import avatarDummy from "../../assets/images/avatar-dummy.png";
import { createNewLog } from "../../features/logsSlice";
import { useToasts } from "react-toast-notifications";
import { browserDetect } from "../../utils/userAgentUtils";

function SideBar({ localUser }) {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const userAccessibility = localUser.DatabaseAccessibility[0];
  const userAccount = localUser.UserAccount;
  const [isCollaped, setCollapse] = useState(true);
  const innerWidth = useSelector(selectInnerWidth);
  const handleOutClick = () => {
    setCollapse(true);
  };
  const handleLogout = () => {
    removeLocalUser();
    dispatch(
      createNewLog({
        Actions: "Logout",
        Account: userAccount,
        Status: "Done",
        Notes: `Browser: ${browserDetect()}`,
      })
    );
    addToast("Logout Successfully!", { appearance: "success" });
    dispatch(setUserCredential(null));
  };
  const handleToggleCollapse = () => {
    setCollapse(!isCollaped);
  };
  return innerWidth <= 767 ? (
    <Outclick onOutClick={handleOutClick}>
      <SideBarContent
        isAdminAccess={userAccessibility}
        innerWidth={innerWidth}
        isCollaped={isCollaped}
        handleLogout={handleLogout}
        handleToggleCollapse={handleToggleCollapse}
        forceCollapse={handleOutClick}
      />
    </Outclick>
  ) : (
    <SideBarContent
      isAdminAccess={userAccessibility}
      innerWidth={innerWidth}
      isCollaped={isCollaped}
      handleLogout={handleLogout}
      handleToggleCollapse={handleToggleCollapse}
      forceCollapse={handleOutClick}
    />
  );
}

function SideBarContent({
  isAdminAccess,
  innerWidth,
  isCollaped,
  handleLogout,
  handleToggleCollapse,
  forceCollapse,
}) {
  const userCredential = useSelector(selectUserCredential);
  const avatarUrl = userCredential?.Avatar
    ? userCredential.Avatar[0].url
    : avatarDummy;
  return (
    <nav
      className="navbar navbar-vertical fixed-left navbar-expand-md navbar-light"
      id="sidebar"
      style={{ zIndex: 999, height: innerWidth <= 767 ? "" : "100vh" }}
    >
      <div className="container-fluid h-100">
        <button
          className="navbar-toggler"
          onClick={handleToggleCollapse}
          style={{ width: "40px" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link
          className="navbar-brand text-center"
          to="/"
          onClick={forceCollapse}
        >
          <img
            src="./favicon.ico"
            className="navbar-brand-img mx-auto"
            alt="..."
          />
          <div className="text-secondary font-italic mt-1">Empla</div>
        </Link>
        <div
          className="navbar-collapse collapsing"
          style={{
            height: isCollaped ? "0" : "287.766px",
            overflowY: innerWidth <= 767 ? "auto" : "",
          }}
        >
          <form className="mb-3 d-md-flex">
            <Search placeholder="Search..." />
          </form>
          <div
            className="navbar-list"
            style={{ flex: 1, overflow: "hidden auto" }}
          >
            <ul className="navbar-nav h-100">
              {innerWidth <= 767 && (
                <h6 className="navbar-heading px-3">Menu</h6>
              )}
              <IconContext.Provider value={{ size: "1.5em" }}>
                {SIDENAV.map((route) => {
                  if (
                    isAdminAccess === null &&
                    privateRoutes.includes(route.path)
                  ) {
                    return false;
                  } else
                    return (
                      <li className="nav-item" key={route.path}>
                        <NavLink
                          style={({ isActive }) => {
                            return {
                              backgroundColor: isActive ? "#e7e7e7" : "",
                            };
                          }}
                          className="nav-link"
                          to={route.path}
                          onClick={forceCollapse}
                        >
                          <IconWrapper>{route.icon}</IconWrapper>
                          {route.label}
                        </NavLink>
                      </li>
                    );
                })}
                {innerWidth <= 767 && (
                  <>
                    <hr className="dropdown-divider my-3" />
                    <h6 className="navbar-heading px-3">Account</h6>
                    <NavLink
                      style={({ isActive }) => {
                        return {
                          backgroundColor: isActive ? "#e7e7e7" : "",
                        };
                      }}
                      to="/profile"
                      className="nav-link d-flex"
                      onClick={forceCollapse}
                    >
                      <IconWrapper>
                        <MdSupervisorAccount size="25px" />
                      </IconWrapper>{" "}
                      Profile
                    </NavLink>
                    <NavLink
                      style={({ isActive }) => {
                        return {
                          backgroundColor: isActive ? "#e7e7e7" : "",
                        };
                      }}
                      to="/settings"
                      className="nav-link d-flex"
                      onClick={forceCollapse}
                    >
                      <IconWrapper>
                        <MdSettings size="25px" />
                      </IconWrapper>{" "}
                      Settings
                    </NavLink>
                    <NavLink
                      style={({ isActive }) => {
                        return {
                          backgroundColor: isActive ? "#e7e7e7" : "",
                        };
                      }}
                      to="/notification"
                      className="nav-link d-flex"
                      onClick={forceCollapse}
                    >
                      <IconWrapper>
                        <MdNotifications size="25px" />
                      </IconWrapper>{" "}
                      Notification
                    </NavLink>
                    <hr className="dropdown-divider mx-3" />
                    <Link
                      to="/login"
                      className="nav-link d-flex"
                      onClick={handleLogout}
                    >
                      <IconWrapper>
                        <MdLogout size="25px" />
                      </IconWrapper>{" "}
                      Logout
                    </Link>
                  </>
                )}
              </IconContext.Provider>
            </ul>
          </div>
        </div>
        <div className="navbar-user d-md-flex">
          <Link
            className="navbar-user-link d-none d-md-block"
            to="/notification"
          >
            <MdNotifications size="25px" />
          </Link>
          <div className="dropup">
            <div className="dropdown-toggle" style={{ cursor: "pointer" }}>
              <div className="avatar avatar-sm avatar-online">
                <img
                  src={avatarUrl}
                  style={{
                    maskImage: "none",
                    WebkitMaskImage: "none",
                  }}
                  className="avatar-img rounded-circle"
                  alt="..."
                />
              </div>
            </div>
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">
                Profile
              </Link>
              <Link to="/settings" className="dropdown-item">
                Settings
              </Link>
              <hr className="dropdown-divider" />
              <Link
                to="/login"
                className="dropdown-item"
                onClick={handleLogout}
              >
                Logout
              </Link>
            </div>
          </div>
          <button
            className="navbar-user-link d-none d-md-block"
            style={{
              backgroundColor: "transparent",
              textDecoration: "none",
              border: "none",
            }}
          >
            <MdOutlineChecklist size="25px" />
          </button>
        </div>
      </div>
    </nav>
  );
}

const IconWrapper = styled.div`
  margin-right: 10px;
  margin-left: 5px;
`;

SideBar.propTypes = {
  localUser: PropTypes.object,
};

export default SideBar;
