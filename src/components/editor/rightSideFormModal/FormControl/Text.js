import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { MdRemoveRedEye } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFormSubmit,
  setFormSubmit,
} from "../../../../features/editorSlice";

export default function Text({
  tabIndex,
  table,
  name,
  label,
  value,
  onValueChange,
  readOnly,
  isRequired,
  additionRegex,
  maxLength,
  minLength,
  isPassword,
}) {
  const dispatch = useDispatch();
  const formSubmit = useSelector(selectFormSubmit);
  const [displayValue, setDisplayValue] = useState(value);
  const [error, setError] = useState({ hasError: false, errorMsg: "" });
  const [isShowPassword, setIsShowPassword] = useState(true);
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
        delete newObj[name];
        dispatch(setFormSubmit({ ...newObj }));
      }
    }
  };
  const handleValidate = () => {
    if (
      displayValue === "" ||
      displayValue === null ||
      displayValue === undefined
    ) {
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
    } else if (maxLength) {
      if (displayValue.length > maxLength) {
        setError({
          hasError: true,
          errorMsg: `${label} has maximum ${maxLength} characters!`,
        });
      }
    } else if (minLength) {
      if (displayValue.length < minLength) {
        setError({
          hasError: true,
          errorMsg: `${label}'s at least ${maxLength} characters!`,
        });
      }
    } else {
      setError({ hasError: false, errorMsg: "" });
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={`Text_${table}_${name}`} ref={labelRef}>
        {`${label} `}
        {isRequired && <span className="text-danger">*</span>}
      </label>
      {isPassword ? (
        <div className="input-group input-group-merge">
          <input
            id={`Text_${table}_${name}`}
            tabIndex={tabIndex}
            autoComplete="off"
            ref={inputRef}
            name={name}
            className="form-control form-control-appended"
            disabled={readOnly}
            type={isShowPassword ? "password" : "text"}
            value={displayValue}
            onChange={handleChange}
            onBlur={handleValidate}
            placeholder={`Enter ${label}...`}
          />
          <div className="input-group-append">
            <div
              className="input-group-text"
              style={{
                borderTopRightRadius: "0.375rem",
                borderBottomRightRadius: "0.375rem",
              }}
            >
              <MdRemoveRedEye
                size={20}
                onClick={() => setIsShowPassword(!isShowPassword)}
                style={{ cursor: "pointer" }}
                color={!isShowPassword ? "#1e81b0" : ""}
              />
            </div>
          </div>
        </div>
      ) : (
        <input
          id={`Text_${table}_${name}`}
          tabIndex={tabIndex}
          autoComplete="off"
          ref={inputRef}
          name={name}
          className="form-control"
          disabled={readOnly}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleValidate}
          placeholder={`Enter ${label}...`}
        />
      )}

      {error.hasError && (
        <div className="err-text text-danger mt-1">{error.errorMsg}</div>
      )}
    </div>
  );
}

Text.propTypes = {
  tabIndex: PropTypes.number,
  table: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onValueChange: PropTypes.func,
  readOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  additionRegex: PropTypes.any,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  isPassword: PropTypes.bool,
};
