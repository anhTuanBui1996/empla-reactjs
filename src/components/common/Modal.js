import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Outclick from "../../hoc/Outclick";
import Button from "./Button";
import { MdArrowRight } from "react-icons/md";

function Modal({ children, onModalHide, isModalDisplay }) {
  const [isDisplay, setDisplay] = useState(false);
  const handleHideModal = () => {
    setDisplay(false);
    onModalHide && onModalHide();
  };
  useEffect(() => {
    setDisplay(isModalDisplay);
  }, [isModalDisplay]);
  return (
    <ModalWrapper isDisplay={isDisplay}>
      <Outclick onOutClick={handleHideModal}>
        <ModalContent isDisplay={isDisplay}>
          <ModalBody>
            <Button
              style={{ position: "absolute", left: "-5px", top: "0" }}
              className="py-1"
              onClick={handleHideModal}
            >
              <MdArrowRight size="20px" />
            </Button>
            {children}
          </ModalBody>
        </ModalContent>
      </Outclick>
    </ModalWrapper>
  );
}

export const ModalWrapper = styled.div`
  visibility: ${(props) => (props.isDisplay ? "visible" : "hidden")};
  opacity: ${(props) => (props.isDisplay ? "1" : "0")};
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2000;
  width: 100%;
  height: 100%;
  transition: opacity 0.5s linear, visibility 0.5s linear;
`;
export const ModalContent = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 25%;
  height: 100%;
  padding: 0 2em;
  background: #fff;
  aligh-items: center;
  overflow-y: scroll;
  scroll-behavior: smooth;
  right: ${(props) => (props.isDisplay ? "0" : "-100%")};
  @media (max-width: 1150px) {
    width: 30%;
    right: ${(props) => (props.isDisplay ? "0" : "-30%")};
  }
  @media (max-width: 1000px) {
    width: 40%;
    right: ${(props) => (props.isDisplay ? "0" : "-40%")};
  }
  @media (max-width: 768px) {
    width: 50%;
    right: ${(props) => (props.isDisplay ? "0" : "-50%")};
  }
  @media (max-width: 600px) {
    width: 60%;
    right: ${(props) => (props.isDisplay ? "0" : "-60%")};
  }
  @media (max-width: 468px) {
    width: 100%;
  }
  transition: all 0.5s ease-in-out;
`;
export const ModalBody = styled.div`
  margin: 1.5em 0;
`;

export default Modal;
