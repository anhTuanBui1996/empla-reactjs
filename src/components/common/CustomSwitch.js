import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useAutoGenerate from "../hooks/useAutoGenerate";

function CustomSwitch({ tabIndex, inputValue, onSwitchChange }) {
  const [toggleId, setToggleId] = useState("");
  const generate = useAutoGenerate();
  /* eslint-disable */
  useEffect(() => {
    setToggleId(generate(5));
  }, []);
  return (
    <CustomSwitchWrapper className="custom-control custom-switch">
      <input
        tabIndex={tabIndex}
        type="checkbox"
        className="custom-control-input"
        id={`customSwitch_${toggleId}`}
        checked={inputValue ? true : false}
        onChange={(e) => {
          onSwitchChange(e.target.checked);
        }}
      />
      <CustomLabel
        className="custom-control-label"
        htmlFor={`customSwitch_${toggleId}`}
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
  tabIndex: PropTypes.number,
  inputValue: PropTypes.bool,
  onSwitchChange: PropTypes.func.isRequired,
};

export default CustomSwitch;
