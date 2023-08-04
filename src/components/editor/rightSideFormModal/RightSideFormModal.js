import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import Modal from "../../common/Modal";
import Row from "../../layout/Row";
import Col from "../../layout/Col";
import Button from "../../common/Button";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  resetFormData,
  selectFormData,
  selectFormSubmit,
  selectSelectedRowData,
  setFormData,
  setFormSubmit,
} from "../../../features/editorSlice";
import { parseFieldName } from "../../../utils/stringUtils";
import { selectMetadata } from "../../../features/metadataSlice";
import { VALIDATE_RULE } from "../../../constants";
import LineText from "./FormControl/LineText";
import TextArea from "./FormControl/TextArea";
import DatePicker from "./FormControl/DatePicker";
import FilePicker from "./FormControl/FilePicker";
import FormSelect from "./FormControl/FormSelect";

function RightSideFormModal({
  formName, // table name of Airtable
  model,
  requiredFields,
  readOnlyFields,
  type,
  isModalDisplay,
  handleCloseForm,
  onFormSubmitted,
  createAndModifySlice,
  deleteSlice,
}) {
  const dispatch = useDispatch();
  const { removeAllToasts } = useToasts();

  const editorFormData = useSelector(selectFormData);
  const selectedRowFormData = useSelector(selectSelectedRowData);
  const formSubmit = useSelector(selectFormSubmit);

  // Form State
  const [formChanged, setFormChanged] = useState({});
  const isFormChanged = useMemo(() => {
    let isChanged = false;
    Object.values(formChanged).forEach((v) => v && (isChanged = true));
    return isChanged;
  }, [formChanged]);

  // Get the metadata of base
  const baseMetadata = useSelector(selectMetadata);
  const tableMetadata = baseMetadata.tables.find(
    (table) => table.name === formName
  );

  // Reset form data when type is "create"
  useEffect(() => {
    if (isModalDisplay) {
      removeAllToasts();
      dispatch(setFormSubmit({}));
      if (type === "create") {
        dispatch(setFormData(new model()));
      } else {
        dispatch(setFormData(new model(selectedRowFormData.fields)));
      }
    } else {
      setTimeout(() => {
        removeAllToasts();
        dispatch(resetFormData());
      }, 500);
    }
    // eslint-disable-next-line
  }, [type, model, isModalDisplay]);

  // Handlers
  const handleFormControlValueChanged = (v) => {
    setFormChanged({ ...formChanged, [v.name]: v.value });
  };
  const handleValidate = () => {
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formChanged, formSubmit);
    if (handleValidate()) {
      if (onFormSubmitted) {
        onFormSubmitted();
      }
    }
  };
  const handleDelete = (e) => {
    e.preventDefault();
  };

  return (
    <Modal onModalHide={handleCloseForm} isModalDisplay={isModalDisplay}>
      <Row className="py-4 justify-content-center">
        <Col columnSize={["auto"]}>
          <h1 className="font-weight-bold">
            {type === "create" ? `Add new ${formName}` : `Edit the ${formName}`}
          </h1>
        </Col>
      </Row>
      <hr className="navbar-divider" />
      <form
        className="form"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormContent
          editorFormData={editorFormData}
          formName={formName}
          readOnlyFields={readOnlyFields}
          requiredFields={requiredFields}
          tableMetadata={tableMetadata}
          setFormControlValueChanged={handleFormControlValueChanged}
        />
        <hr className="navbar-divider" />
        <Row className="justify-content-center mt-5">
          <Col columnSize={["12"]}>
            <Button
              bgHoverColor="#0049c7"
              className="px-4 py-3 w-100"
              type="submit"
              onClick={isFormChanged ? handleSubmit : undefined}
              disabled={!isFormChanged}
            >
              {type === "create" ? `Add new` : `Submit changes`}
            </Button>
          </Col>
        </Row>
        {type === "edit" && (
          <Row className="justify-content-center">
            <Col columnSize={["12"]}>
              <Button
                bgColor="#ff4949"
                bgHoverColor="#ff0000"
                className="px-4 py-3 w-100"
                onClick={handleDelete}
              >
                {`Commit delete`}
              </Button>
            </Col>
          </Row>
        )}
      </form>
    </Modal>
  );
}

// Fill to the form content
const FormContent = ({
  formName,
  tableMetadata,
  requiredFields,
  readOnlyFields,
  editorFormData,
  setFormControlValueChanged,
}) => {
  if (!editorFormData) return null;
  return Object.entries(editorFormData).map((field, i) => {
    let formControl = null;
    let fieldName = field[0];
    let fieldValue = field[1];
    let fieldMetadata = tableMetadata?.fields.find(
      (metadata) => fieldName === metadata.name
    );
    let fieldType = fieldMetadata?.type;
    let fieldLable = parseFieldName(fieldName);
    let isRequiredField = requiredFields.indexOf(fieldName) !== -1;
    let isReadOnlyField = readOnlyFields.indexOf(fieldName) !== -1;
    let isPassword = fieldName.toLowerCase() === "password";
    switch (fieldType) {
      case "singleLineText":
        formControl = (
          <LineText
            key={i}
            tabIndex={i + 1}
            table={formName}
            name={fieldName}
            label={fieldLable}
            isRequired={isRequiredField}
            value={fieldValue}
            onValueChange={setFormControlValueChanged}
            readOnly={isReadOnlyField}
            isPassword={isPassword}
          />
        );
        break;
      case "multilineText":
        formControl = (
          <TextArea
            key={i}
            tabIndex={i + 1}
            table={formName}
            name={fieldName}
            label={fieldLable}
            isRequired={isRequiredField}
            value={fieldValue}
            onValueChange={setFormControlValueChanged}
            readOnly={isReadOnlyField}
          />
        );
        break;
      case "formula":
        formControl = (
          <LineText
            key={i}
            tabIndex={i + 1}
            table={formName}
            name={fieldName}
            label={fieldLable}
            isRequired={isRequiredField}
            value={fieldValue}
            onValueChange={setFormControlValueChanged}
            readOnly
          />
        );
        break;
      case "email":
        formControl = (
          <LineText
            key={i}
            tabIndex={i + 1}
            name={fieldName}
            table={formName}
            label={fieldLable}
            isRequired={isRequiredField}
            value={fieldValue}
            onValueChange={setFormControlValueChanged}
            readOnly={isReadOnlyField}
            additionRegex={VALIDATE_RULE.email.pattern}
            maxLength={VALIDATE_RULE.email.maxLength}
            minLength={VALIDATE_RULE.email.minLength}
          />
        );
        break;
      case "date":
        formControl = (
          <DatePicker
            key={i}
            tabIndex={i + 1}
            name={fieldName}
            table={formName}
            label={fieldLable}
            isRequired={isRequiredField}
            value={fieldValue}
            onValueChange={setFormControlValueChanged}
            readOnly={isReadOnlyField}
          />
        );
        break;
      case "dateTime":
        formControl = (
          <DatePicker
            key={i}
            tabIndex={i + 1}
            name={fieldName}
            table={formName}
            label={fieldLable}
            isRequired={isRequiredField}
            value={fieldValue}
            onValueChange={setFormControlValueChanged}
            isDisplayTime
            readOnly={isReadOnlyField}
          />
        );
        break;
      case "multipleAttachments":
        formControl = (
          <FilePicker
            key={i}
            tabIndex={i + 1}
            table={formName}
            name={fieldName}
            label={fieldLable}
            value={fieldValue}
            onValueChange={setFormControlValueChanged}
          />
        );
        break;
      case "singleSelect":
        formControl = (
          <FormSelect
            key={i}
            tabIndex={i + 1}
            table={formName}
            name={fieldName}
            label={fieldLable}
            value={fieldValue}
            fieldMetadata={fieldMetadata}
            onValueChange={setFormControlValueChanged}
          />
        );
        break;
      case "multipleSelects":
        formControl = (
          <FormSelect
            key={i}
            tabIndex={i + 1}
            table={formName}
            name={fieldName}
            label={fieldLable}
            value={fieldValue}
            fieldMetadata={fieldMetadata}
            isMulti
            onValueChange={setFormControlValueChanged}
          />
        );
        break;
      default:
        // console.error(`New field type detected: ${fieldType}`);
        break;
    }

    return formControl;
  });
};

RightSideFormModal.propTypes = {
  /**
   * Name of table in Airtable
   */
  formName: PropTypes.string,
  model: PropTypes.func,
  requiredFields: PropTypes.arrayOf(PropTypes.string),
  readOnlyFields: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.oneOf(["create", "edit"]).isRequired,
  isModalDisplay: PropTypes.bool,
  handleCloseForm: PropTypes.func,
  onFormSubmitted: PropTypes.func,
  createAndModifySlice: PropTypes.func,
  deleteSlice: PropTypes.func,
};

export default RightSideFormModal;
