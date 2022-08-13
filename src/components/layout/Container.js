import React from "react";
import PropTypes from "prop-types";

function Container({ children, fluid, gap }) {
  return (
    <div
      className={"pb-4 container" + (fluid ? "-fluid" : "")}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: gap ? `${gap}px` : "",
      }}
    >
      {children}
    </div>
  );
}

Container.propTypes = {
  fluid: PropTypes.bool,
  /**
   * Distance between rows in pixel
   */
  gap: PropTypes.number,
};

export default Container;
