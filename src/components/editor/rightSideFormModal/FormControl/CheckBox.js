import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  selectFormSubmit,
  setFormSubmit,
} from "../../../../features/editorSlice";
import { useState, useRef, useEffect } from "react";
import CustomSwitch from "../../../common/CustomSwitch";

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
  const [displayValue, setDisplayValue] = useState(value ? true : false);
  const onSwitchChange = (e) => {
    e.stopPropagation();
    setDisplayValue(!displayValue);
  };
  useEffect(() => {
    if (onValueChange) {
      if (displayValue !== value) {
        onValueChange({ name, value: true });
        dispatch(setFormSubmit({ ...formSubmit, [name]: displayValue }));
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
    // eslint-disable-next-line
  }, [displayValue]);
  return (
    <div className="form-group">
      <span
        ref={labelRef}
        style={{ display: "inline-block", marginBottom: "0.5rem" }}
      >
        {`${label} `}
      </span>
      <CustomSwitch
        tabIndex={tabIndex}
        id={`CheckBox_${table}_${name}`}
        inputValue={displayValue ? true : false}
        onSwitchChange={onSwitchChange}
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
