import React from "react";
import PropTypes from "prop-types";
import MainContent from "../layout/MainContent";
import MainHeader from "../layout/MainHeader";
import TopBg from "../../assets/images/top-page-bg.png";
import AvatarDummy from "../../assets/images/avatar-dummy.png";
import TopPage from "../common/TopPage";

function Checkin() {
  return (
    <MainContent>
      <TopPage topBg={TopBg} avatarUrl={AvatarDummy} />
      <MainHeader
        title="Check-in"
        subTitle="Check-in before working and check-out before leaving. Remember!"
      />
      <MainContent></MainContent>
    </MainContent>
  );
}

Checkin.propTypes = {};

export default Checkin;
