import React, { useState } from "react";
import PropTypes from "prop-types";
import { MdMoreVert } from "react-icons/md";
import { SpinnerCircular } from "spinners-react";
import styled from "styled-components";

function Card({
  elementList,
  cardHeader,
  cardFooter,
  inactive,
  isLoading,
  noBodyPadding,
}) {
  const [navActivated, setActiveNav] = useState(0);
  const handleChangeTab = (e, tabIndex) => {
    e.preventDefault();
    setActiveNav(tabIndex);
  };
  return (
    <div className={"card" + (inactive ? " card-inactive" : "")}>
      {cardHeader && (
        <div
          className="card-header justify-content-between align-items-center flex-wrap"
          style={{ gap: "5px", paddingRight: "5px", height: "auto" }}
        >
          <h4 className="card-header-title font-weight-bold mr-auto py-2">
            {cardHeader.title}
            {cardHeader.badge && (
              <span
                className={
                  "badge font-weight-bold ml-2 badge-" + cardHeader.badge.theme
                }
              >
                {cardHeader.badge.label}
              </span>
            )}
          </h4>
          {cardHeader.rightTitle && cardHeader.rightTitle}
          {cardHeader.navList && (
            <ul className="nav nav-tabs nav-tabs-sm card-header-tabs">
              {cardHeader.navList.map((navLinkTitle, navIndex) => (
                <li className="nav-item mx-0" key={navIndex}>
                  <NavLinkHover
                    className={`nav-link bg-white px-3${
                      navIndex === navActivated ? " active" : ""
                    }`}
                    onClick={(e) => handleChangeTab(e, navIndex)}
                  >
                    {navLinkTitle}
                  </NavLinkHover>
                </li>
              ))}
            </ul>
          )}
          {cardHeader.extension && <MdMoreVert size="20px" />}
        </div>
      )}
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center py-3">
          <SpinnerCircular thickness={150} color="blue" />
        </div>
      ) : noBodyPadding ? (
        elementList[navActivated]
      ) : (
        <div className="card-body">{elementList[navActivated]}</div>
      )}
      {cardFooter && cardFooter}
    </div>
  );
}

Card.propTypes = {
  /**
   * The element list, if the card has only 1 element, then no need
   * the navList and elementList is array that has 1 element (length=1)
   */
  elementList: PropTypes.array.isRequired,
  cardHeader: PropTypes.shape({
    title: PropTypes.any.isRequired,
    badge: PropTypes.shape({
      theme: PropTypes.oneOf([
        "primary",
        "secondary",
        "success",
        "danger",
        "warning",
        "info",
        "light",
        "dark",
      ]),
      label: PropTypes.string,
    }),
    rightTitle: PropTypes.any,
    extension: PropTypes.any,
    navList: PropTypes.arrayOf(PropTypes.string),
  }),
  cardFooter: PropTypes.any,
  inactive: PropTypes.bool,
  noBodyPadding: PropTypes.bool,
};

const NavLinkHover = styled.div`
  cursor: pointer;
`;

export default Card;
