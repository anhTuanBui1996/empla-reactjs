export default function FormGroupTextArea({
  table,
  label,
  formGroupData,
  name,
}) {
  return (
    <div className="form-group">
      <label htmlFor="Notes">Notes</label>
      <textarea
        name="Notes"
        data-table="Staff"
        data-type={newStaffForm.Staff.Notes["data-type"]}
        className="form-control"
        value={newStaffForm.Staff.Notes.value && newStaffForm.Staff.Notes.label}
        onChange={handleStaffInput}
        onBlur={handleValidate}
        placeholder="Notes..."
        style={{
          resize: "none",
        }}
      />
    </div>
  );
}

FormGroupTextArea.propTypes = {
  table: PropTypes.string,
  label: PropTypes.string,
  formGroupData: PropTypes.string,
  name: PropTypes.string,
};
