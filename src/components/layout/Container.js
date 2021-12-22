import React from "react";

function Container({ children, fluid }) {
  return <div className={"container" + (fluid ? "-fluid" : "")}>{children}</div>;
}

export default Container;
