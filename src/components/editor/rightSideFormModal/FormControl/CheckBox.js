import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  selectFormSubmit,
  setFormSubmit,
} from "../../../../features/editorSlice";
import { useState, useRef } from "react";

export default function CheckBox({
  tabIndex,
  table,
  name,
  label,
  value,
  onValueChange,
}) {
  const labelRef = useRef(null);
  const dispatch = useDispatch();
  const formSubmit = useSelector(selectFormSubmit);
  const [displayValue, setDisplayValue] = useState(value);
  const onSwitchChange = () => {
    let newValue = !displayValue;
    setDisplayValue(newValue);
    if (onValueChange) {
      if (displayValue !== value) {
        onValueChange({ name, value: true });
        dispatch(setFormSubmit({ ...formSubmit, [name]: newValue }));
      } else {
        onValueChange({ name, value: false });
        let newObj = {};
        Object.assign(newObj, formSubmit);
        if (newObj[name] !== undefined) {
          delete newObj[name];
        }
        dispatch(setFormSubmit({ ...newObj }));
      }
    }
  };
  return (
    <div id={`CheckBox_${table}_${name}`} className="form-group">
      <label
        htmlFor={`CheckBox_${table}_${name}`}
        ref={labelRef}
        style={{ display: "inline-block", marginBottom: "0.5rem" }}
      >
        {`${label} `}
      </label>
      <input
        className="ml-3"
        id={`CheckBox_${table}_${name}`}
        type="checkbox"
        tabIndex={tabIndex}
        checked={displayValue ? true : false}
        onChange={onSwitchChange}
      />
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
};
