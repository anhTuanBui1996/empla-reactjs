import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useAutoGenerate from "../hooks/useAutoGenerate";

function CustomSwitch({ inputValue, onSwitchChange }) {
  const [value, setValue] = useState(inputValue ? inputValue : false);
  const [toggleId, setToggleId] = useState("");
  const generate = useAutoGenerate();
  /* eslint-disable */
  useEffect(() => {
    setToggleId(generate(5));
  }, []);
  return (
    <CustomSwitchWrapper className="custom-control custom-switch">
      <input
        type="checkbox"
        className="custom-control-input"
        id={`cardToggle${toggleId}`}
        checked={value}
        onChange={(e) => {
          setValue(e.target.checked);
          onSwitchChange(e.target.checked);
        }}
      />
      <CustomLabel
        className="custom-control-label"
        htmlFor={`cardToggle${toggleId}`}
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
  inputValue: PropTypes.bool,
  onSwitchChange: PropTypes.func.isRequired,
};

export default CustomSwitch;
