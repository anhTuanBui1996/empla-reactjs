import PropTypes from "prop-types";
import { useState } from "react";

export default function FormGroupText({
  name,
  label,
  value,
  formControlRef,
  readOnly,
  isRequired,
}) {
  const [error, setError] = useState({ hasError: false, errorMsg: "" });
  const handleChange = (e) => {};
  const handleValidate = (e) => {};
  return (
    <div className="form-group">
      <label htmlFor={name} ref={formControlRef}>
        {`${label} `}
        {isRequired && <span className="text-danger">*</span>}
      </label>
      <input
        id={name}
        name={name}
        className="form-control"
        disabled={readOnly}
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleValidate}
        placeholder={`Enter ${label}...`}
      />
      {error.hasError && (
        <div className="err-text text-danger mt-1">{error.errorMsg}</div>
      )}
    </div>
  );
}

FormGroupText.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  formControlRef: PropTypes.any,
  readOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  additionRegex: PropTypes.string,
};
