import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

function CustomSwitch({ id, tabIndex, inputValue, onSwitchChange }) {
  return (
    <CustomSwitchWrapper className="custom-control custom-switch">
      <input
        tabIndex={tabIndex}
        type="checkbox"
        className="custom-control-input"
        id={id}
        checked={inputValue ? true : false}
        readOnly
      />
      <CustomLabel
        className="custom-control-label"
        htmlFor={id}
        onClickCapture={onSwitchChange}
      />
    </CustomSwitchWrapper>
  );
}
const CustomSwitchWrapper = styled.div`
  padding-left: 3rem !important;
`;
const CustomLabel = styled.label`
  ::before {
    left: -3rem !important;
  }
  ::after {
    left: -2.8125rem !important;
  }
`;

CustomSwitch.propTypes = {
  id: PropTypes.string,
  tabIndex: PropTypes.number,
  inputValue: PropTypes.bool,
  onSwitchChange: PropTypes.func.isRequired,
};

export default CustomSwitch;
