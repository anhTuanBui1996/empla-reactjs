import React from "react";
import PropTypes from "prop-types";

function Col({ columnSize, children, className, style }) {
  let colString = "";
  columnSize?.forEach((colItem) => {
    colString += "col-" + colItem + " ";
  });
  className && (colString += className);
  colString = colString.trim();
  return (
    <div className={colString} style={style}>
      {children}
    </div>
  );
}

Col.propTypes = {
  columnSize: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Col;
