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

function ReactCalendar({
  id,
  name,
  className,
  ref,
  value,
  isDisplayTime,
  readOnly,
  onChange,
  onBlur,
  styleForFilterRow,
}) {
  const isFilterRow = useMemo(() => {
    if (!className) return false;
    return className.includes("filter-row");
  }, [className]);
  const [referenceElement, setReferenceElement] = useState(ref);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  const [showPickerBox, setShowPickerBox] = useState(false);
  const dateValue = useMemo(() => value && new Date(value), [value]);
  const dateLabel = useMemo(
    () =>
      dateValue
        ? dateValue.toLocaleDateString("en-GB", {
            timeZone: "Asia/Bangkok",
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: isDisplayTime ? "2-digit" : undefined,
            minute: isDisplayTime ? "2-digit" : undefined,
            second: isDisplayTime ? "2-digit" : undefined,
          })
        : "",
    [dateValue, isDisplayTime]
  );

  const handleClearDate = () => onChange("");

  const [timeValue, setTimeValue] = useState(
    dateValue && isDisplayTime
      ? {
          hour: dateValue?.getHours(),
          minute: dateValue?.getMinutes(),
          second: dateValue?.getSeconds(),
        }
      : {
          hour: 0,
          minute: 0,
          second: 0,
        }
  );

  return readOnly ? (
    <DatePickerInput
      id={id}
      ref={setReferenceElement}
      name={name}
      className={`react-custom-calendar${className ? " " + className : ""}`}
      type="text"
      value={dateLabel}
      placeholder="dd/MM/yyyy"
      data-inputmask="'mask': '99/99/9999'"
      readOnly
      style={{ ...styleForFilterRow }}
    />
  ) : (
    <Outclick
      onOutClick={() => {
        setShowPickerBox(false);
        onBlur && onBlur();
      }}
    >
      <div
        className={`input-group input-group-rounded input-group-merge${
          className ? " " + className : ""
        }`}
        ref={setReferenceElement}
        style={{ ...styleForFilterRow }}
      >
        <DatePickerInput
          id={id}
          name={name}
          className={`react-custom-calendar form-control form-control-appended${
            className ? " " + className : ""
          }`}
          type="text"
          value={dateLabel ? dateLabel : ""}
          placeholder={`dd/MM/yyyy${isDisplayTime ? " HH:mm:ss" : ""}`}
          onClick={() => {
            setShowPickerBox(true);
          }}
          onBlur={onBlur}
          isReadOnly={readOnly}
          style={{
            ...styleForFilterRow,
            width: isFilterRow ? (isDisplayTime ? "210px" : "140px") : "",
          }}
          readOnly
        />
        <div className="input-group-append" style={{ ...styleForFilterRow }}>
          <div
            className="input-group-text"
            style={{
              ...styleForFilterRow,
              borderTopRightRadius: "0.375rem",
              borderBottomRightRadius: "0.375rem",
            }}
          >
            {value && (
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
              onChange(newDateValue.toISOString());
              setShowPickerBox(false);
            }}
          />
          {isDisplayTime && (
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
  styleForFilterRow: PropTypes.object,
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
