import React, { useState } from "react";
import PropTypes from "prop-types";
import { MdMoreVert } from "react-icons/md";
import { SpinnerCircular } from "spinners-react";
import styled from "styled-components";
import Dropdown from "./Dropdown";

function Card({
  className,
  elementList,
  cardHeader,
  cardFooter,
  inactive,
  isLoading,
  noBodyPadding,
  onChangeTab,
}) {
  const [navActivated, setActiveNav] = useState(0);
  const handleChangeTab = (e, tabIndex) => {
    e.stopPropagation();
    setActiveNav(tabIndex);
    onChangeTab && onChangeTab(tabIndex);
  };
  return (
    <CardWrapper
      className={`d-flex card${inactive ? " card-inactive" : ""}${
        className ? ` ${className}` : ""
      }`}
    >
      {cardHeader && (
        <div
          className="card-header justify-content-between align-items-center flex-wrap"
          style={{ gap: "5px", paddingRight: "5px", height: "auto" }}
        >
          <div className="card-header-title d-flex justify-content-between align-items-center">
            <div className="card-header-left-title d-flex flex-nowrap font-weight-bold mr-auto py-2">
              <span style={{ whiteSpace: "nowrap", lineHeight: 1.6 }}>
                {cardHeader.title}
              </span>
              {cardHeader.badge && (
                <span
                  className={
                    "badge font-weight-bold ml-2 badge-" +
                    cardHeader.badge.theme
                  }
                  style={{ lineHeight: 1.5 }}
                >
                  {cardHeader.badge.label}
                </span>
              )}
            </div>
            {cardHeader.rightTitle && (
              <div className="card-header-right-title d-flex flex-nowrap font-weight-bold ml-auto py-2">
                {cardHeader.rightTitle}
              </div>
            )}
          </div>
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
          {cardHeader.extension && (
            <Dropdown
              variant="link"
              position="right"
              title={<MdMoreVert size="20px" />}
            >
              <ExtensionBox className="extension-box">
                {Array.isArray(cardHeader.extension)
                  ? cardHeader.extension.map(({ label, onClick }) => (
                      <ExtensionItemBtn onClick={onClick}>
                        {`${label}`}
                      </ExtensionItemBtn>
                    ))
                  : cardHeader.extension}
              </ExtensionBox>
            </Dropdown>
          )}
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
    </CardWrapper>
  );
}

Card.propTypes = {
  className: PropTypes.string,
  /**
   * The element list, if the card has only 1 element, then no need
   * the navList and elementList is array that has 1 element (length=1)
   */
  elementList: PropTypes.array.isRequired,
  cardHeader: PropTypes.shape({
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.node,
    ]).isRequired,
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
    rightTitle: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.node,
    ]),
    /**
     * Node of extension buttons, the list is flex-column
     */
    extension: PropTypes.oneOfType([
      PropTypes.any,
      PropTypes.node,
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          onClick: PropTypes.func,
        })
      ),
    ]),
    navList: PropTypes.arrayOf(PropTypes.string),
  }),
  cardFooter: PropTypes.any,
  inactive: PropTypes.bool,
  /**
   * To use this feature, must set value for the cardHeader.extension
   */
  noBodyPadding: PropTypes.bool,
  /**
   * Callback function receive tab card index (count from 0)
   */
  onChangeTab: PropTypes.func,
};

const CardWrapper = styled.div`
  transition: opacity ease-in-out 0.5s;
  margin-bottom: 0;
  box-shadow: 1px 1px 3px 1px #e0e0d1;
`;
const NavLinkHover = styled.div`
  cursor: pointer;
`;
const ExtensionBox = styled.div`
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
export const ExtensionItemBtn = styled("button").attrs({
  className: "extension-btn btn btn-light",
})`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 200px;
  line-height: 1;
`;

export default Card;
