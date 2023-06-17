import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { usePopper } from "react-popper";
import { Calendar } from "@natscale/react-calendar";
import "@natscale/react-calendar/dist/main.css";
import Outclick from "../../hoc/Outclick";
import { useMemo } from "react";

function ReactCalendar(props) {
  const [referenceElement, setReferenceElement] = useState(props.ref);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  const [showPickerBox, setShowPickerBox] = useState(false);
  const [dateValue, setDateValue] = useState(undefined);
  const dateLabel = useMemo(
    () =>
      dateValue?.toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [dateValue]
  );
  useEffect(() => {
    if (typeof props.value === "string") {
      setDateValue(new Date(props.value));
    } else {
      setDateValue(props.value);
    }
  }, [props.value]);
  return props.readOnly ? (
    <DatePickerInput
      id={props.id}
      ref={setReferenceElement}
      name={props.name}
      className={`react-custom-calendar${
        props.className ? " " + props.className : ""
      }`}
      type="text"
      value={dateLabel}
      readOnly
    />
  ) : (
    <Outclick
      onOutClick={() => {
        setShowPickerBox(false);
        props.onBlur();
      }}
    >
      <DatePickerInput
        id={props.id}
        ref={setReferenceElement}
        name={props.name}
        className={`react-custom-calendar${
          props.className ? " " + props.className : ""
        }`}
        type="text"
        value={dateLabel}
        placeholder="Click to pick a day..."
        onClick={() => {
          setShowPickerBox(true);
        }}
        readOnly
      />
      {showPickerBox && (
        <DatePickerPopper
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <Calendar
            className="shadow p-3 mb-5 bg-body-tertiary rounded"
            value={props.value}
            onChange={(v) => {
              const dateValue = new Date(v);
              setDateValue(dateValue);
              props.onChange(dateValue);
              setShowPickerBox(false);
            }}
          />
          <div ref={setArrowElement} style={styles.arrow} />
        </DatePickerPopper>
      )}
    </Outclick>
  );
}

ReactCalendar.propTypes = {
  id: PropTypes.string,
  tabIndex: PropTypes.number,
  name: PropTypes.string,
  "data-table": PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.string,
};

const DatePickerInput = styled.input`
  cursor: $ ${(props) => (props.readOnly ? "auto" : "pointer")};
`;
const DatePickerPopper = styled.div`
  z-index: 3000;
`;

export default ReactCalendar;
