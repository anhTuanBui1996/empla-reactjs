import React from "react";
import styled from "styled-components";

function MainContent({ children, isPopupOpened }) {
  return (
    <MainContentWrapper className="main-content" isPopupOpened={isPopupOpened}>
      {children}
    </MainContentWrapper>
  );
}

export const MainContentWrapper = styled.div`
  ${(props) => props.isPopupOpened && `overflow: hidden`}
`;

export default MainContent;
