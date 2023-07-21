import PropTypes from "prop-types";
import ReactCalendar from "../../../specific/ReactCalendar";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFormSubmit,
  setFormSubmit,
} from "../../../../features/editorSlice";

export default function DatePicker({
  tabIndex,
  table,
  name,
  label,
  value,
  onValueChange,
  isDisplayTime,
  readOnly,
  isRequired,
}) {
  const dispatch = useDispatch();
  const formSubmit = useSelector(selectFormSubmit);
  const [displayValue, setDisplayValue] = useState(value);
  const [error, setError] = useState({ hasError: false, errorMsg: "" });
  const labelRef = useRef(null);

  useEffect(() => setDisplayValue(value), [value]);

  const handleChange = (dateValue) => {
    let currentValue = dateValue;
    setDisplayValue(currentValue);
    dispatch(setFormSubmit({ ...formSubmit, [name]: currentValue }));
    if (onValueChange) {
      if (currentValue !== value) {
        onValueChange({ name, value: true });
      } else {
        onValueChange({ name, value: false });
        let newObj = {};
        Object.assign(newObj, formSubmit);
        if (newObj[name]) {
          delete newObj[name];
        }
        dispatch(setFormSubmit({ ...newObj }));
      }
    }
  };
  const handleValidate = () => {
    if (isRequired && value === "") {
      setError({ hasError: true, errorMsg: `${label} must not be empty!` });
      labelRef.current.scrollIntoView();
    } else {
      setError({ hasError: false, errorMsg: "" });
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={`DatePicker_${table}_${name}`} ref={labelRef}>
        {`${label} `}
        {isRequired && <span className="text-danger">*</span>}
      </label>
      <ReactCalendar
        id={`DatePicker_${table}_${name}`}
        tabIndex={tabIndex}
        className="form-control"
        name={name}
        value={displayValue}
        isDisplayTime={isDisplayTime}
        isReadOnly={readOnly}
        onChange={handleChange}
        onBlur={handleValidate}
      />
      {error.hasError && (
        <div className="err-text text-danger mt-1">{error.errorMsg}</div>
      )}
    </div>
  );
}

DatePicker.propTypes = {
  tabIndex: PropTypes.number,
  table: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onValueChange: PropTypes.func,
  isDisplayTime: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
};
