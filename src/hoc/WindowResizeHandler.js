import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setInnerHeight, setInnerWidth } from "../features/windowSlice";

function WindowResizeHandler({ children }) {
  const dispatch = useDispatch();
  const handleResize = () => {
    dispatch(setInnerWidth(window.innerWidth));
    dispatch(setInnerHeight(window.innerHeight));
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  return <div className="resize-handler">{children}</div>;
}

export default WindowResizeHandler;
