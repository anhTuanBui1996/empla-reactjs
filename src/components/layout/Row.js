import React from "react";
import PropTypes from "prop-types";
import { useMemo } from "react";

function Row({ children, className, style }) {
  const classString = useMemo(() => `row ${className}`, [className]);
  
  return (
    <div className={classString} style={style}>
      {children}
    </div>
  );
}

Row.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Row;
