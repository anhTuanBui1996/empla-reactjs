import React, { useRef, useEffect } from "react";

function Outclick({ children, onOutClick }) {
  const outClickRef = useRef();
  useEffect(() => {
    const handleOutClick = (e) => {
      const { target } = e;
      if (
        !outClickRef.current.contains(target) &&
        !document.getElementById("__filestack-picker")
      ) {
        onOutClick();
      }
    };
    document.addEventListener("mousedown", handleOutClick);
    return () => {
      document.removeEventListener("mousedown", handleOutClick);
    };
  }, [onOutClick]);
  return (
    <div className="out-clicker" ref={outClickRef}>
      {children}
    </div>
  );
}

export default Outclick;
