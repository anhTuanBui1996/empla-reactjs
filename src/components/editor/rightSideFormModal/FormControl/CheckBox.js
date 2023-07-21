import { useDispatch, useSelector } from "react-redux";
import CustomSwitch from "../../../common/CustomSwitch";
import PropTypes from "prop-types";
import {
  selectFormSubmit,
  setFormSubmit,
} from "../../../../features/editorSlice";

export default function CheckBox({
  tabIndex,
  table,
  name,
  label,
  value,
  onValueChange,
}) {
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
    <div id={`CheckBox_${table}_${name}`} className="form-control">
      {label}
      <CustomSwitch
        tabIndex={tabIndex}
        inputValue={displayValue}
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
