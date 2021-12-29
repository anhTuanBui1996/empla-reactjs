import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { usePopper } from "react-popper";
import { Calendar } from "@natscale/react-calendar";
import "@natscale/react-calendar/dist/main.css";
import Outclick from "../../hoc/Outclick";

function DatePicker(props) {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  const [showPickerBox, setShowPickerBox] = useState(false);
  const [dateValue, setDateValue] = useState(null);
  return (
    <Outclick
      onOutClick={() => {
        setShowPickerBox(false);
        props.onBlur();
      }}
    >
      <DatePickerInput
        ref={setReferenceElement}
        name={props.name}
        data-table={props["data-table"]}
        className={`form-control${
          props.className ? " " + props.className : ""
        }`}
        type="text"
        onClick={() => {
          props.onFocus({
            target: {
              "data-table": props["data-table"],
              name: props.name,
              value: dateValue ? dateValue : "",
              label: dateValue ? dateValue.toLocaleDateString() : "",
            },
            inputType: "DatePicker",
          });
          setShowPickerBox(true);
        }}
      >
        {dateValue ? (
          dateValue.toLocaleDateString()
        ) : (
          <span className="text-muted">Click to select a date...</span>
        )}
      </DatePickerInput>
      {showPickerBox && (
        <DatePickerPopper
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <Calendar
            useDarkMode
            value={props.value}
            onChange={(v) => {
              setDateValue(v);
              props.onChange({
                target: {
                  "data-table": props["data-table"],
                  name: props.name,
                  value: v,
                  label: v.toLocaleDateString(),
                },
                inputType: "DatePicker",
              });
              setShowPickerBox(false);
            }}
          />
          <div ref={setArrowElement} style={styles.arrow} />
        </DatePickerPopper>
      )}
    </Outclick>
  );
}

DatePicker.propTypes = {
  name: PropTypes.string,
  "data-table": PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.object,
};

const DatePickerInput = styled.div`
  cursor: pointer;
`;
const DatePickerPopper = styled.div`
  z-index: 3000;
`;

export default DatePicker;
