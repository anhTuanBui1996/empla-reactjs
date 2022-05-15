import React from "react";
import PropTypes from "prop-types";

function Container({ children, fluid }) {
  return (
    <div className={"pb-4 container" + (fluid ? "-fluid" : "")}>
      {children}
    </div>
  );
}

Container.propTypes = {
  fluid: PropTypes.bool,
};

export default Container;
