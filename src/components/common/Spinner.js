import React from "react";
import { SpinnerDotted } from "spinners-react";

function Spinner({ size, color }) {
  return <SpinnerDotted size={size} color={color} className="mx-2" />;
}

export default Spinner;
