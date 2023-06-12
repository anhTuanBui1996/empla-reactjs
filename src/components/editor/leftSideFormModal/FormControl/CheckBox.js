import CustomSwitch from "../../../common/CustomSwitch";

export default function CheckBox({ inputValue, onSwitchChange }) {
  return (
    <CustomSwitch inputValue={inputValue} onSwitchChange={onSwitchChange} />
  );
}
