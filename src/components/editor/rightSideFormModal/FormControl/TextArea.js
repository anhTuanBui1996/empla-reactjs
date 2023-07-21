import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFormSubmit,
  setFormSubmit,
} from "../../../../features/editorSlice";

export default function TextArea({
  tabIndex,
  table,
  name,
  label,
  value,
  onValueChange,
  readOnly,
  isRequired,
  additionRegex,
}) {
  const dispatch = useDispatch();
  const formSubmit = useSelector(selectFormSubmit);
  const [displayValue, setDisplayValue] = useState(value);
  const [error, setError] = useState({ hasError: false, errorMsg: "" });
  const labelRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => setDisplayValue(value), [value]);

  const handleChange = (e) => {
    let currentValue = e.target.value;
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
    if (displayValue === "") {
      setError({ hasError: true, errorMsg: `${label} must not be empty!` });
      labelRef.current.scrollIntoView();
    } else if (additionRegex) {
      if (!displayValue.match(additionRegex)) {
        setError({ hasError: true, errorMsg: `Incorrect ${label} format!` });
      } else {
        if (displayValue.match(additionRegex)[0] !== displayValue) {
          setError({ hasError: true, errorMsg: `Incorrect ${label} format!` });
        }
      }
    } else {
      setError({ hasError: false, errorMsg: "" });
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={`TextArea_${table}_${name}`} ref={labelRef}>
        {`${label} `}
        {isRequired && <span className="text-danger">*</span>}
      </label>
      <textarea
        id={`TextArea_${table}_${name}`}
        tabIndex={tabIndex}
        autoComplete="off"
        ref={inputRef}
        name={name}
        className="form-control"
        disabled={readOnly}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleValidate}
        placeholder={`Enter ${label}...`}
        style={{
          resize: "none",
          height: "200px"
        }}
      />
      {error.hasError && (
        <div className="err-text text-danger mt-1">{error.errorMsg}</div>
      )}
    </div>
  );
}

TextArea.propTypes = {
  tabIndex: PropTypes.number,
  table: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onValueChange: PropTypes.func,
  readOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  additionRegex: PropTypes.string,
};
