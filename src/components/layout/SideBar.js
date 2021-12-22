import React, { useState } from "react";
import styled from "styled-components";
import { MdNotifications, MdOutlineChecklist } from "react-icons/md";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { SIDENAV } from "../../constants";
import { removeLocalUser } from "../../services/localStorage.service";
import { useDispatch } from "react-redux";
import { setUserCredential } from "../../features/userSlice";
import Search from "../common/Search";
import Outclick from "../../hoc/Outclick";

function SideBar() {
  const dispatch = useDispatch();
  const [isCollaped, setCollapse] = useState(true);
  const handleLogout = () => {
    removeLocalUser();
    dispatch(setUserCredential(null));
  };
  const handleToggleCollapse = () => {
    setCollapse(!isCollaped);
  };
  return (
    <nav
      className="navbar navbar-vertical fixed-left navbar-expand-md navbar-light"
      id="sidebar"
    >
      <div className="container-fluid">
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
          onClick={() => setCollapse(true)}
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
          style={{ height: isCollaped ? "0" : "287.766px" }}
        >
          <form className="mt-4 mb-3 d-md-flex">
            <Search />
          </form>
          <ul className="navbar-nav">
            <IconContext.Provider value={{ size: "1.5em" }}>
              {SIDENAV.map((route) => (
                <li className="nav-item" key={route.path}>
                  <Link
                    className="nav-link"
                    to={route.path}
                    onClick={() => setCollapse(true)}
                  >
                    <IconWrapper>{route.icon}</IconWrapper>
                    {route.label}
                  </Link>
                </li>
              ))}
            </IconContext.Provider>
          </ul>
          <div className="mt-auto"></div>
        </div>
        <div className="navbar-user d-md-flex">
          <Link
            to="#sidebarModalActivity"
            className="navbar-user-link d-none d-md-block"
          >
            <MdNotifications size="25px" />
          </Link>
          <div className="dropup">
            <div className="dropdown-toggle" style={{ cursor: "pointer" }}>
              <div className="avatar avatar-sm avatar-online">
                <img
                  src="./assets/img/avatars/profiles/avatar-1.jpg"
                  className="avatar-img rounded-circle"
                  alt="..."
                />
              </div>
            </div>
            <div className="dropdown-menu">
              <Link to="./profile-posts.html" className="dropdown-item">
                Profile
              </Link>
              <Link to="./account-general.html" className="dropdown-item">
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
          <Link
            className="navbar-user-link d-none d-md-block"
            data-toggle="tooltip"
            data-placement="top"
            title="Quick check-in"
            to="checkin"
          >
            <MdOutlineChecklist size="25px" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

const IconWrapper = styled.div`
  margin-right: 10px;
  margin-left: 5px;
`;

export default SideBar;
