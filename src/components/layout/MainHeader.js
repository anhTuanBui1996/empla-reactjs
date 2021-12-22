import PropTypes from "prop-types";
import React from "react";
import Col from "./Col";

function MainHeader({ title, subTitle, children }) {
  return (
    <div className="header">
      <div className="container-fluid">
        <div className="header-body">
          <div className="row">
            <Col columnSize={["auto"]}>
              <h1 className="header-title font-weight-bold">{title}</h1>
              <span className="header-subtitle">{subTitle}</span>
            </Col>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

MainHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
};

export default MainHeader;
