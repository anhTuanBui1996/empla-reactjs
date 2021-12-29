import React from "react";
import PropTypes from "prop-types";

function Row({ children, className }) {
  let classString = "row";
  className && (classString += " " + className);
  return <div className={classString}>{children}</div>;
}

Row.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Row;
