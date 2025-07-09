import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { selectLinkReferenceModalShow } from "../features/editorSlice";

function Outclick({ children, onOutClick, className }) {
  const isLinkReferenceBoxOpened = useSelector(selectLinkReferenceModalShow);
  const outClickRef = useRef(null);
  useEffect(() => {
    const handleOutClick = (e) => {
      e.stopPropagation();
      const { target } = e;
      if (
        !outClickRef.current.contains(target) &&
        ((!target.classList.contains("link-reference-box") &&
          target.nodeName !== "path") ||
          (isLinkReferenceBoxOpened &&
            ((!target.classList.value.startsWith("dropdown") &&
              !target.contains(outClickRef.current)) ||
              target.classList.contains("modal-body") ||
              target.classList.contains("card-header"))))
      ) {
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
    <OutclickWrapper
      className={`out-clicker${className ? ` ${className}` : ""}`}
      ref={outClickRef}
    >
      {children}
    </OutclickWrapper>
  );
}

const OutclickWrapper = styled.div``;

export default Outclick;
