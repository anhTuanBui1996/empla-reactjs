import React, { useState } from "react";
import PropTypes from "prop-types";
import { MdMoreVert } from "react-icons/md";
import { Link } from "react-router-dom";

function Card({ elementList, cardHeader, cardFooter, inactive, noBody }) {
  const [navActivated, setActiveNav] = useState(0);
  const handleChangeTab = (e, tabIndex) => {
    e.preventDefault();
    setActiveNav(tabIndex);
  };
  return (
    <div className={"card" + (inactive ? " inactive" : "")}>
      {cardHeader && (
        <>
          <div
            className="card-header"
            style={{ gap: "5px", paddingRight: "5px" }}
          >
            <h4 className="card-header-title font-weight-bold mr-auto">
              {cardHeader.title}
              {cardHeader.badge && (
                <span
                  className={
                    "badge font-weight-bold ml-2 badge-" +
                    cardHeader.badge.theme
                  }
                >
                  {cardHeader.badge.label}
                </span>
              )}
            </h4>
            {cardHeader.rightTitle && (
              <span className="text-muted">{cardHeader.rightTitle}</span>
            )}
            {cardHeader.extension && <MdMoreVert size="20px" />}
          </div>
          {cardHeader.navList && (
            <ul className="nav nav-tabs nav-tabs-sm card-header-tabs">
              {cardHeader.navList.map((nav) => (
                <li className="nav-item">
                  <Link className="nav-link active" onClick={handleChangeTab}>
                    {nav}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      {noBody ? (
        elementList[navActivated]
      ) : (
        <div className="card-body">{elementList[navActivated]}</div>
      )}
      {cardFooter && cardFooter}
    </div>
  );
}

Card.propTypes = {
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
  noBody: PropTypes.bool,
};

export default Card;
