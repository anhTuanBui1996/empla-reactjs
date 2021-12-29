import React from "react";
import PropTypes from "prop-types";

function Col({ columnSize, children, className }) {
  let colString = "";
  columnSize?.forEach((colItem) => {
    colString += "col-" + colItem + " ";
  });
  className && (colString += className);
  colString = colString.trim();
  return <div className={colString}>{children}</div>;
}

Col.propTypes = {
  columnSize: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Col;
