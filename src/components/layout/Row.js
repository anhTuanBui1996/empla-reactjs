import React from "react";

function Row({ children, className }) {
  let classString = "row";
  className && (classString += " " + className);
  return <div className={classString}>{children}</div>;
}

export default Row;
