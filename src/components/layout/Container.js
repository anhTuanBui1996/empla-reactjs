import React from "react";
import PropTypes from "prop-types";

function Container({ children, fluid }) {
  return (
    <div className={"container" + (fluid ? "-fluid" : "")}>
      {children}
    </div>
  );
}

Container.propTypes = {
  fluid: PropTypes.bool,
};

export default Container;
