import React, { useEffect, useState } from "react";
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
  const [dateValue, setDateValue] = useState("");
  useEffect(() => {
    setDateValue(props.value);
  }, [props.value]);
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
        value={dateValue}
        onChange={() => {}}
        placeholder="Click to pick a day..."
        onFocus={() => {
          props.onFocus({
            target: {
              "data-table": props["data-table"],
              name: props.name,
              value: dateValue,
              label: dateValue,
            },
            inputType: "DatePicker",
          });
          setShowPickerBox(true);
        }}
      />
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
              const dateString = v.toLocaleDateString();
              setDateValue(dateString);
              props.onChange({
                target: {
                  "data-table": props["data-table"],
                  name: props.name,
                  value: dateString,
                  label: dateString,
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
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.string,
};

const DatePickerInput = styled.input`
  cursor: pointer;
`;
const DatePickerPopper = styled.div`
  z-index: 3000;
`;

export default DatePicker;
