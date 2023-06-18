import PropTypes from "prop-types";
import ReactCalendar from "../../../specific/ReactCalendar";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectFormData, setFormData } from "../../../../features/editorSlice";

export default function DatePicker({
  tabIndex,
  table,
  name,
  label,
  value,
  isDisplayTime,
  readOnly,
  isRequired,
}) {
  const dispatch = useDispatch();
  const editorFormData = useSelector(selectFormData);
  const [error, setError] = useState({ hasError: false, errorMsg: "" });
  const labelRef = useRef(null);

  const handleChange = (dateValue) => {
    dispatch(setFormData({ ...editorFormData, [name]: dateValue }));
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
        value={value}
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
  isDisplayTime: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
};
