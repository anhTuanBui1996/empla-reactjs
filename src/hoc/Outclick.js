import React, { useRef, useEffect } from "react";
import styled from "styled-components";

function Outclick({ children, onOutClick }) {
  const outClickRef = useRef(null);
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
    <OutclickWrapper className="out-clicker" ref={outClickRef}>
      {children}
    </OutclickWrapper>
  );
}

const OutclickWrapper = styled.div``;

export default Outclick;
