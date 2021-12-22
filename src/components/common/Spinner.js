import React from "react";
import { SpinnerCircular } from "spinners-react";

function Spinner({ size, color }) {
  return <SpinnerDiamond size={size} color={color} className="mx-2" />;
}

export default Spinner;
