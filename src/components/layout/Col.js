import React, { useMemo } from "react";
import PropTypes from "prop-types";

function Col({ columnSize, children, className, style }) {
  const classString = useMemo(() => {
    let returnString = "";
    columnSize?.forEach((colItem) => {
      returnString += "col-" + colItem + " ";
    });
    className && (returnString += className);
    return returnString.trim();
  }, [columnSize, className]);

  return (
    <div
      className={classString}
      style={{ ...style, paddingTop: "12px", paddingBottom: "12px" }}
    >
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
