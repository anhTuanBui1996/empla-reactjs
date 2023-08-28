import React, { useMemo, useState } from "react";
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
  removeToken,
  resetUserSlice,
  selectUserCredential,
  selectUserInfo,
} from "../../features/userSlice";
import PropTypes from "prop-types";
import Search from "../common/Search";
import { selectInnerWidth } from "../../features/windowSlice";
import Outclick from "../../hoc/Outclick";
import avatarDummy from "../../assets/images/avatar-dummy.png";
import { createNewLog } from "../../features/tables/logsSlice";
import { useToasts } from "react-toast-notifications";
import { browserDetect } from "../../utils/userAgentUtils";

function SideBar() {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const userInfo = useSelector(selectUserInfo);
  const userAccessibility = userInfo?.fields.DatabaseAccessibility[0];
  const userAccount = userInfo?.fields.Account;
  const userCredential = useSelector(selectUserCredential);
  const [isCollaped, setCollapse] = useState(true);
  const innerWidth = useSelector(selectInnerWidth);
  const handleOutClick = () => {
    setCollapse(true);
  };
  const handleLogout = () => {
    dispatch(
      createNewLog({
        Actions: "Logout",
        Account: userAccount,
        RecordAffected: userInfo?.id,
        IdAffected: userInfo?.fields.StaffId,
        TableAffected: "Staff",
        Notes: `Browser: ${browserDetect()}, logout and delete token ${
          userCredential.Token
        }`,
      })
    );
    dispatch(removeToken(userCredential.Token));
    removeLocalUser();
    dispatch(resetUserSlice());
    addToast("Logout Successfully!", { appearance: "success" });
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
        isPositionFixedAtTop
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
  isPositionFixedAtTop,
}) {
  const userInfo = useSelector(selectUserInfo);
  const userInfoFields = useMemo(() => {
    return userInfo?.fields;
  }, [userInfo]);

  const avatarUrl = userInfoFields?.Avatar
    ? userInfoFields.Avatar[0].url
    : avatarDummy;
  return (
    <nav
      className="navbar navbar-vertical fixed-left navbar-expand-md navbar-light"
      id="sidebar"
      style={{
        zIndex: 999,
        height: innerWidth <= 767 ? "" : "100vh",
        boxShadow: "2px 2px 8px 2px #e0e0d1",
        paddingLeft: isPositionFixedAtTop ? "" : 0,
        paddingRight: isPositionFixedAtTop ? "" : 0,
      }}
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
          className="navbar-collapse collapsing px-0 mx-0"
          style={{
            height: isCollaped ? "0" : "287.766px",
            overflowY: innerWidth <= 767 ? "auto" : "",
          }}
        >
          <form className={`mb-3 d-md-flex${isPositionFixedAtTop ? "" : " px-4"}`}>
            <Search
              id={`sidebar-search`}
              placeholder="Search..."
            />
          </form>
          <div
            className="navbar-list"
            style={{ flex: 1, overflow: "hidden auto" }}
          >
            <ul className="navbar-nav h-100 mx-0">
              {innerWidth <= 767 && (
                <h6 className="navbar-heading px-2">Menu</h6>
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
                              color: isActive ? "#12263f" : "",
                            };
                          }}
                          className={`nav-link ${
                            isPositionFixedAtTop ? "px-3" : "px-4"
                          }`}
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
                    <h6 className="navbar-heading px-2">Account</h6>
                    <li className="nav-item">
                      <NavLink
                        style={({ isActive }) => {
                          return {
                            backgroundColor: isActive ? "#e7e7e7" : "",
                          };
                        }}
                        to="/profile"
                        className={`nav-link ${
                          isPositionFixedAtTop ? "px-3" : "px-4"
                        }`}
                        onClick={forceCollapse}
                      >
                        <IconWrapper>
                          <MdSupervisorAccount size="25px" />
                        </IconWrapper>{" "}
                        Profile
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        style={({ isActive }) => {
                          return {
                            backgroundColor: isActive ? "#e7e7e7" : "",
                          };
                        }}
                        to="/settings"
                        className={`nav-link ${
                          isPositionFixedAtTop ? "px-3" : "px-4"
                        }`}
                        onClick={forceCollapse}
                      >
                        <IconWrapper>
                          <MdSettings size="25px" />
                        </IconWrapper>{" "}
                        Settings
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        style={({ isActive }) => {
                          return {
                            backgroundColor: isActive ? "#e7e7e7" : "",
                          };
                        }}
                        to="/notification"
                        className={`nav-link ${
                          isPositionFixedAtTop ? "px-3" : "px-4"
                        }`}
                        onClick={forceCollapse}
                      >
                        <IconWrapper>
                          <MdNotifications size="25px" />
                        </IconWrapper>{" "}
                        Notification
                      </NavLink>
                    </li>
                    <hr className="dropdown-divider mx-3" />
                    <li className="nav-item">
                      <Link
                        to="/login"
                        className={`nav-link ${
                          isPositionFixedAtTop ? "px-3" : "px-4"
                        }`}
                        onClick={handleLogout}
                      >
                        <IconWrapper>
                          <MdLogout size="25px" />
                        </IconWrapper>{" "}
                        Logout
                      </Link>
                    </li>
                  </>
                )}
              </IconContext.Provider>
            </ul>
          </div>
        </div>
        <div className="navbar-user d-md-flex mx-0">
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
            className="navbar-user-link d-none d-md-block px-0"
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
