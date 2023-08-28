import React, { useRef, useEffect } from "react";
import styled from "styled-components";

function Outclick({ children, onOutClick }) {
  const outClickRef = useRef(null);
  useEffect(() => {
    const handleOutClick = (e) => {
      e.stopPropagation();
      const { target } = e;
      if (!outClickRef.current.contains(target)) {
        onOutClick();
      }
    };
    document.addEventListener("mousedown", handleOutClick);
    return () => {
      document.removeEventListener("mousedown", handleOutClick);
    };
    // eslint-disable-next-line
  }, []);
  return (
    <OutclickWrapper className="out-clicker" ref={outClickRef}>
      {children}
    </OutclickWrapper>
  );
}

const OutclickWrapper = styled.div``;

export default Outclick;
