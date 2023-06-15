import ReactCalendar from "../../../specific/ReactCalendar";

export default function FormGroupDatePicker({
  table,
  label,
  formGroupData,
  name,
}) {
  return (
    <div className="form-group">
      <label htmlFor="StartWorkingDay" ref={refList.StartWorkingDay}>
        Start Working Day <span className="text-danger">*</span>
      </label>
      <ReactCalendar
        className="form-control"
        name="StartWorkingDay"
        data-table="Staff"
        data-type={newStaffForm.Staff.StartWorkingDay["data-type"]}
        value={
          newStaffForm.Staff.StartWorkingDay.value &&
          newStaffForm.Staff.StartWorkingDay.label
        }
        onChange={handleStaffInput}
        onBlur={handleValidate}
      />
      {errorForm.errMsg.Staff.StartWorkingDay !== "" && errorForm.isShowMsg && (
        <div className="err-text text-danger mt-1">
          {errorForm.errMsg.Staff.StartWorkingDay}
        </div>
      )}
    </div>
  );
}

FormGroupDatePicker.propTypes = {};
