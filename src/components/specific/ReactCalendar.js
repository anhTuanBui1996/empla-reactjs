import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { usePopper } from "react-popper";
import { Calendar } from "@natscale/react-calendar";
import "@natscale/react-calendar/dist/main.css";
import Outclick from "../../hoc/Outclick";
import { useMemo } from "react";
import ReactTimePicker from "./ReactTimePicker";
import { MdClose } from "react-icons/md";

function ReactCalendar(props) {
  const [referenceElement, setReferenceElement] = useState(props.ref);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  const [showPickerBox, setShowPickerBox] = useState(false);
  const dateValue = useMemo(
    () => props.value && new Date(props.value),
    [props.value]
  );
  const dateLabel = useMemo(
    () =>
      dateValue
        ? dateValue.toLocaleDateString("en-GB", {
            timeZone: "Asia/Bangkok",
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: props.isDisplayTime ? "2-digit" : undefined,
            minute: props.isDisplayTime ? "2-digit" : undefined,
            second: props.isDisplayTime ? "2-digit" : undefined,
          })
        : "",
    [dateValue, props.isDisplayTime]
  );

  const handleClearDate = () => props.onChange("");

  const [timeValue, setTimeValue] = useState(
    dateValue && props.isDisplayTime
      ? {
          hour: dateValue?.getHours(),
          minute: dateValue?.getMinutes(),
          second: dateValue?.getSeconds(),
        }
      : null
  );

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
      <div
        className="input-group input-group-rounded input-group-merge"
        ref={setReferenceElement}
      >
        <DatePickerInput
          id={props.id}
          name={props.name}
          className={`react-custom-calendar form-control form-control-appended${
            props.className ? " " + props.className : ""
          }`}
          type="text"
          value={dateLabel ? dateLabel : ""}
          placeholder="Click to pick a day..."
          onClick={() => {
            setShowPickerBox(true);
          }}
          onBlur={props.onBlur}
          isReadOnly={props.isReadOnly}
          readOnly
        />
        <div className="input-group-append">
          <div
            className="input-group-text"
            style={{
              borderTopRightRadius: "0.375rem",
              borderBottomRightRadius: "0.375rem",
            }}
          >
            {props.value && (
              <DateClearButton>
                <MdClose
                  size={20}
                  onClick={handleClearDate}
                  style={{ cursor: "pointer" }}
                />
              </DateClearButton>
            )}
          </div>
        </div>
      </div>
      {showPickerBox && (
        <DatePickerPopper
          className="shadow"
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <Calendar
            value={dateValue}
            onChange={(v) => {
              const newDateValue = new Date(v);
              if (timeValue) {
                let { hour, minute, second } = timeValue;
                newDateValue.setHours(hour);
                newDateValue.setMinutes(minute);
                newDateValue.setSeconds(second);
              }
              props.onChange(newDateValue.toISOString());
              setShowPickerBox(false);
            }}
          />
          {props.isDisplayTime && (
            <ReactTimePicker
              timeValue={timeValue}
              setTimeValue={setTimeValue}
            />
          )}
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
  className: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.any,
  isDisplayTime: PropTypes.bool,
};

const DatePickerInput = styled.input.attrs((props) => ({
  isReadOnly: props.isReadOnly ? true : false,
}))`
  border-radius: 0.375rem !important;
  cursor: ${(props) => (props.isReadOnly ? "unset" : "pointer")};
`;
const DatePickerPopper = styled.div`
  z-index: 3000;
`;
const DateClearButton = styled.button`
  z-index: 100;
  line-height: 1;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 5px;
  padding: 0 !important;
  color: #ff1919e7 !important;
  border-radius: 4px;
  border: none;
  background: none;
  :hover {
    background-color: #ff1919e7 !important;
    color: #fff !important;
  }
`;

export default ReactCalendar;
