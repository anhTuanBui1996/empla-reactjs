import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentInputFocusing,
  selectFormData,
  setCurrentInputFocusing,
  setFormData,
} from "../../../../features/editorSlice";
import { MdRemoveRedEye } from "react-icons/md";

export default function Text({
  tabIndex,
  table,
  name,
  label,
  value,
  readOnly,
  isRequired,
  additionRegex,
  maxLength,
  minLength,
  isPassword,
}) {
  const dispatch = useDispatch();
  const currentInputFocused = useSelector(selectCurrentInputFocusing);
  const editorFormData = useSelector(selectFormData);
  const [error, setError] = useState({ hasError: false, errorMsg: "" });
  const [isShowPassword, setIsShowPassword] = useState(true);
  const labelRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(
    () => {
      if (inputRef.current.id === currentInputFocused) {
        inputRef.current.focus();
      }
    },
    // eslint-disable-next-line
    [value]
  );

  const handleFocus = () =>
    dispatch(setCurrentInputFocusing(`Text_${table}_${name}`));
  const handleChange = (e) =>
    dispatch(setFormData({ ...editorFormData, [name]: e.target.value }));
  const handleValidate = () => {
    dispatch(setCurrentInputFocusing(undefined));
    if (value === "") {
      setError({ hasError: true, errorMsg: `${label} must not be empty!` });
      labelRef.current.scrollIntoView();
    } else if (additionRegex) {
      if (!value.match(additionRegex)) {
        setError({ hasError: true, errorMsg: `Incorrect ${label} format!` });
      } else {
        if (value.match(additionRegex)[0] !== value) {
          setError({ hasError: true, errorMsg: `Incorrect ${label} format!` });
        }
      }
    } else if (maxLength) {
      if (value.length > maxLength) {
        setError({
          hasError: true,
          errorMsg: `${label} has maximum ${maxLength} characters!`,
        });
      }
    } else if (minLength) {
      if (value.length < minLength) {
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
            value={value}
            onFocus={handleFocus}
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
          value={value}
          onFocus={handleFocus}
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
  readOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  additionRegex: PropTypes.any,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  isPassword: PropTypes.bool,
};
