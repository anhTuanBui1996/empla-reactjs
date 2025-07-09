import React, { useEffect, useMemo } from "react";
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
import LineText from "./formControl/LineText";
import TextArea from "./formControl/TextArea";
import DatePicker from "./formControl/DatePicker";
import FilePicker from "./formControl/FilePicker";
import FormSelect from "./formControl/FormSelect";
import LookUpValues from "./formControl/LookUpValues";
import CheckBox from "./formControl/CheckBox";
import LinkRecordPicker from "./formControl/LinkRecordPicker";

function FormModal({
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

  const selectedRowFormData = useSelector(selectSelectedRowData);
  const formData = useSelector(selectFormData);
  const formSubmit = useSelector(selectFormSubmit);

  // Form State
  const isFormChanged = useMemo(() => {
    return formSubmit && Object.keys(formSubmit).length > 0;
  }, [formSubmit]);

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
      removeAllToasts();
      dispatch(resetFormData());
    }
    // eslint-disable-next-line
  }, [type, model, isModalDisplay]);

  // Handlers
  const handleValidateBeforeSubmit = () => {
    console.log(formData, formSubmit);
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidateBeforeSubmit()) {
      // submit action
      if (onFormSubmitted) {
        createAndModifySlice(formSubmit);
        onFormSubmitted();
      }
    }
  };
  const handleDelete = (e) => {
    e.preventDefault();
    // delete action
    if (onFormSubmitted) {
      deleteSlice(selectedRowFormData.id);
      onFormSubmitted();
    }
  };
  const handleCloseFormModal = () => {
    dispatch(resetFormData());
    handleCloseForm();
  };

  return (
    <Modal onModalHide={handleCloseFormModal} isModalDisplay={isModalDisplay}>
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
          formData={formData}
          formName={formName}
          readOnlyFields={readOnlyFields}
          requiredFields={requiredFields}
          tableMetadata={tableMetadata}
        />
        <hr className="navbar-divider" />
        <Row className="justify-content-center mt-3">
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
  formData,
  tableMetadata,
  requiredFields,
  readOnlyFields,
}) => {
  if (!formData) return null;
  return Object.entries(formData).map((field, i) => {
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
            readOnly={isReadOnlyField}
            isPassword={isPassword}
            inputMaskData={"'mask': '999-999-9999'"}
            inputMaskPlaceholder={"xxx-xxx-xxxx"}
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
            readOnly={isReadOnlyField}
            additionRegex={VALIDATE_RULE.email.pattern}
            maxLength={VALIDATE_RULE.email.maxLength}
            minLength={VALIDATE_RULE.email.minLength}
            inputMaskPlaceholder={"...@..."}
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
          />
        );
        break;
      case "checkbox":
        formControl = (
          <CheckBox
            key={i}
            tabIndex={i + 1}
            table={formName}
            name={fieldName}
            label={fieldLable}
            value={fieldValue}
          />
        );
        break;
      case "multipleLookupValues":
        formControl = (
          <LookUpValues
            key={i}
            tabIndex={i + 1}
            table={formName}
            name={fieldName}
            label={fieldLable}
            value={fieldValue}
            fieldMetadata={fieldMetadata}
          />
        );
        break;
      case "multipleRecordLinks":
        formControl = (
          <LinkRecordPicker
            key={i}
            tabIndex={i + 1}
            table={formName}
            name={fieldName}
            label={fieldLable}
            value={fieldValue}
            fieldMetadata={fieldMetadata}
            isRequired={isRequiredField}
            readOnly={isReadOnlyField}
          />
        );
        break;
      default:
        console.error(`New field type detected: ${fieldType} (${fieldName})`);
        break;
    }

    return formControl;
  });
};

FormModal.propTypes = {
  recordId: PropTypes.string,
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

FormContent.propTypes = {
  formName: PropTypes.string,
  formData: PropTypes.any,
  tableMetadata: PropTypes.any,
  requiredFields: PropTypes.array,
  readOnlyFields: PropTypes.array,
  setFormControlValueChanged: PropTypes.object,
};

export default FormModal;
