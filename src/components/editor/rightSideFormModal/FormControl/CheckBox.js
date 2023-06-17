import { useDispatch, useSelector } from "react-redux";
import CustomSwitch from "../../../common/CustomSwitch";
import PropTypes from "prop-types";
import { selectFormData, setFormData } from "../../../../features/editorSlice";
import { useMemo } from "react";

export default function CheckBox({ tabIndex, table, name, label, value }) {
  const inputValue = useMemo(() => {
    if (value) {
      return true;
    }
    return false;
  }, [value]);
  const dispatch = useDispatch();
  const editorFormData = useSelector(selectFormData);
  const onSwitchChange = () => {
    dispatch(setFormData({ ...editorFormData, [name]: inputValue }));
  };
  return (
    <div id={`CheckBox_${table}_${name}`} className="form-control">
      {label}
      <CustomSwitch
        tabIndex={tabIndex}
        inputValue={inputValue}
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
};
