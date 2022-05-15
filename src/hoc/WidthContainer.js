import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectInnerWidth } from "../features/windowSlice";

function WidthContainer({ children }) {
  // we use windowWidth here to catch window resize event
  // eslint-disable-next-line
  const windowWidth = useSelector(selectInnerWidth);
  const [containerWidth, setContainerWidth] = useState(undefined);
  return (
    <div
      className="width-container"
      ref={(containerRef) => setContainerWidth(containerRef?.clientWidth)}
    >
      {containerWidth &&
        React.cloneElement(children, { width: containerWidth })}
    </div>
  );
}

export default WidthContainer;
