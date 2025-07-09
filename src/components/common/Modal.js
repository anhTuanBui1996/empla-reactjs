import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Outclick from "../../hoc/Outclick";
import Button from "./Button";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";

function Modal({ children, onModalHide, isModalDisplay }) {
  const modalRef = useRef();
  const [isDisplay, setDisplay] = useState(false);
  const handleHideModal = () => {
    onModalHide && onModalHide();
  };
  useEffect(() => {
    setDisplay(isModalDisplay);
    isModalDisplay && modalRef.current && (modalRef.current.scrollTop = 0);
  }, [isModalDisplay]);
  return (
    <ModalWrapper isDisplay={isDisplay}>
      <Outclick onOutClick={handleHideModal}>
        <ModalContent isDisplay={isDisplay} ref={modalRef}>
          <ModalBody>
            <Button
              padding="2px"
              style={{
                width: "30px",
                height: "30px",
                position: "absolute",
                right: "10px",
                top: "10px",
                borderRadius: 7,
              }}
              className="py-1"
              onClick={handleHideModal}
              bgColor={"#ff0000"}
              bgHoverColor={"#d53e3e"}
            >
              <MdClose size="20px" />
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
  transition: opacity 0.2s linear, visibility 0.2s linear;
`;
export const ModalContent = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  min-width: 400px;
  width: 80%;
  min-height: 400px;
  height: 80%;
  padding: 0 2em;
  background: #fff;
  aligh-items: center;
  overflow-y: scroll;
  scroll-behavior: smooth;
  top: ${(props) => (props.isDisplay ? "50%" : "30%")};
  left: 50%;
  @media (max-width: 1150px) {
    width: 30%;
  }
  @media (max-width: 1000px) {
    width: 40%;
  }
  @media (max-width: 768px) {
    width: 50%;
  }
  @media (max-width: 600px) {
    width: 60%;
  }
  @media (max-width: 468px) {
    width: 100%;
  }
  transform: translate(-50%, -50%);
  transition: all 0.3s ease-in-out;
  border-radius: 10px;
`;
export const ModalBody = styled.div`
  margin: 1.5em 0;
`;

Modal.propTypes = {
  onModalHide: PropTypes.func,
  isModalDisplay: PropTypes.bool,
};

export default Modal;
