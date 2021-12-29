import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

function TopPage({ topBg, avatarUrl, className }) {
  return (
    <TopPageWrapper className={className}>
      <TopPageBackground topBgUrl={topBg} />
      <Avatar src={avatarUrl} />
    </TopPageWrapper>
  );
}

TopPage.propTypes = {
  topBg: PropTypes.object.isRequired,
};

const TopPageWrapper = styled.div`
  width: 100%;
  position: relative;
`;
const TopPageBackground = styled.div`
  background-image: url(${({ topBgUrl }) => topBgUrl});
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 200px;
`;
const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: absolute;
  bottom: -25%;
  left: 50%;
  transform: translateX(-50%);
`;

export default TopPage;
