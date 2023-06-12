import React, { useEffect, useState } from "react";
import { SpinnerDotted } from "spinners-react";
import styled from "styled-components";

function Loader({ text }) {
  const [componentAvailable, setComponentAvailable] = useState(true);
  const [waitingDots, setWaitingDots] = useState(".");
  const [waitingInterval, setWaitingInterval] = useState(null);
  useEffect(() => {
    if (text && componentAvailable) {
      setWaitingInterval(
        setTimeout(() => {
          if (waitingDots.length > 2) {
            setWaitingDots(".");
          } else {
            setWaitingDots(waitingDots + ".");
          }
        }, 1000)
      );
    }
    return () => {
      clearTimeout(waitingInterval);
      setComponentAvailable(false);
    };
    // eslint-disable-next-line
  }, [text, waitingDots]);
  return (
    <LoaderWrapper>
      <LoaderSpinner>
        <SpinnerDotted size="40%" color="#e0e0e0" className="mx-2" />
        {text && <TextDisplayer>{`${text} ${waitingDots}`}</TextDisplayer>}
      </LoaderSpinner>
    </LoaderWrapper>
  );
}

export const LoaderWrapper = styled.div`
  z-index: 9999;
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: #383838b7;
`;
export const LoaderSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
export const TextDisplayer = styled.span`
  text-align: center;
  color: #fff;
`;

export default Loader;
