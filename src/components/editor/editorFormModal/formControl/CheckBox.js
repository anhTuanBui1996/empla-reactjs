import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  selectFormSubmit,
  setFormSubmit,
} from "../../../../features/editorSlice";
import { useState, useRef, useEffect } from "react";

export default function CheckBox({
  tabIndex,
  table,
  name,
  label,
  value,
  className,
  readOnly,
}) {
  const labelRef = useRef(null);
  const dispatch = useDispatch();
  const formSubmit = useSelector(selectFormSubmit);
  const [displayValue, setDisplayValue] = useState(value ? true : false);
  const onCheckedChange = (e) => {
    e.stopPropagation();
    setDisplayValue(!displayValue);
  };
  useEffect(() => {
    if (
      (displayValue !== value && typeof value === "boolean") ||
      (displayValue && value === undefined)
    ) {
      dispatch(setFormSubmit({ ...formSubmit, [name]: displayValue }));
    } else {
      let newObj = {};
      Object.assign(newObj, formSubmit);
      if (newObj[name] !== undefined) {
        delete newObj[name];
      }
      dispatch(setFormSubmit({ ...newObj }));
    }
    // eslint-disable-next-line
  }, [displayValue]);
  return (
    <div className={`${className ? `${className} ` : ""}form-group`}>
      {label && (
        <span
          className={`${className ? `${className} ` : ""}`}
          ref={labelRef}
          style={{ display: "inline-block", marginBottom: "0.5rem" }}
        >
          {`${label} `}
        </span>
      )}
      <div className={`${className ? `${className} ` : ""}cell-checkbox`}>
        <input
          id={`CheckBox_${table}_${name}`}
          tabIndex={tabIndex}
          name="editor-checkbox"
          className={`${className ? `${className} ` : ""}table-checkbox`}
          type="checkbox"
          checked={displayValue}
          style={{ display: "none" }}
          readOnly={readOnly}
          onChange={onCheckedChange}
        />
        <label
          className={`${
            className ? `${className} ` : ""
          }table-checkbox-label mb-0`}
          htmlFor={`CheckBox_${table}_${name}`}
        >
          <span className={`${className ? `${className}` : ""}`}>
            <svg
              className={`${className ? `${className}` : ""}`}
              width="12px"
              height="9px"
              viewBox="0 0 13 9"
            >
              <polyline
                className={`${className ? `${className}` : ""}`}
                points="1 5 4 8 11 1"
              ></polyline>
            </svg>
          </span>
        </label>
      </div>
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
  className: PropTypes.string,
  readOnly: PropTypes.bool,
};
