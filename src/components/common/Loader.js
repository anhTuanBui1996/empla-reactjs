import React from "react";
import { SpinnerDotted } from "spinners-react";
import styled from "styled-components";

function Loader() {
  return (
    <LoaderWrapper>
      <LoaderSpinner>
        <SpinnerDotted size="40%" color="#e0e0e0" className="mx-2" />
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
  text-align: center;
`;

export default Loader;
