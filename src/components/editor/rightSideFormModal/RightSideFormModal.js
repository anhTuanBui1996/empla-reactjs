import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Modal from "../../common/Modal";
import Row from "../../layout/Row";
import Col from "../../layout/Col";
import Button from "../../common/Button";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { SpinnerCircular } from "spinners-react";
import {
  resetFormData,
  selectFormData,
  selectSelectedRowData,
  setFormData,
} from "../../../features/editorSlice";
import { parseFieldName } from "../../../utils/stringUtils";
import { selectMetadata } from "../../../features/metadataSlice";
import Text from "./FormControl/Text";
import TextArea from "./FormControl/TextArea";
import { compareTwoObject } from "../../../utils/objectUtils";
import { VALIDATE_RULE } from "../../../constants";
import DatePicker from "./FormControl/DatePicker";

function RightSideFormModal({
  formName,
  model,
  requiredFields,
  readOnlyFields,
  type,
  isModalDisplay,
  onFormHide,
}) {
  const dispatch = useDispatch();
  const { addToast, removeAllToasts } = useToasts();

  // Set form data
  const editorFormData = useSelector(selectFormData);
  const selectedRowFormData = useSelector(selectSelectedRowData);

  // Reset form data when type is "create"
  useEffect(() => {
    if (isModalDisplay) {
      removeAllToasts();
      if (type === "create") {
        dispatch(resetFormData());
        dispatch(setFormData(new model()));
        setInitialFormData(new model());
      } else {
        dispatch(setFormData(new model(selectedRowFormData.fields)));
        setInitialFormData(new model(selectedRowFormData.fields));
      }
    }
    // eslint-disable-next-line
  }, [type, isModalDisplay]);

  // Form State
  const [initialFormData, setInitialFormData] = useState(null);
  const [isSfaffFormChanged, setIsSfaffFormChanged] = useState(false);

  // Get the metadata of base
  const baseMetadata = useSelector(selectMetadata);
  const tableMetadata = baseMetadata.tables.find(
    (table) => table.name === formName
  );

  // Fill to the form content
  const FormContent = () => {
    if (!editorFormData) return null;
    return Object.entries(editorFormData).map((field, i) => {
      let formControl = null;
      let fieldName = field[0];
      let fieldValue = field[1];
      let fieldType = tableMetadata?.fields.find(
        (fieldMetadata) => fieldName === fieldMetadata.name
      )?.type;
      let fieldLable = parseFieldName(fieldName);
      let isRequiredField = requiredFields.indexOf(fieldName) !== -1;
      let isReadOnlyField = readOnlyFields.indexOf(fieldName) !== -1;
      let isPassword = fieldName.toLowerCase() === "password";
      switch (fieldType) {
        case "singleLineText":
          formControl = (
            <Text
              key={i}
              tabIndex={i + 1}
              name={fieldName}
              label={fieldLable}
              isRequired={isRequiredField}
              value={fieldValue}
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
            <Text
              key={i}
              tabIndex={i + 1}
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
            <Text
              key={i}
              tabIndex={i + 1}
              name={fieldName}
              label={fieldLable}
              isRequired={isRequiredField}
              value={fieldValue}
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
              label={fieldLable}
              isRequired={isRequiredField}
              value={fieldValue}
              isDisplayTime
              readOnly={isReadOnlyField}
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

  // Check the form data changed form initialFormData
  useEffect(() => {
    if (editorFormData && initialFormData && selectedRowFormData) {
      if (!compareTwoObject(editorFormData, initialFormData)) {
        setIsSfaffFormChanged(true);
      }
    }
  }, [editorFormData, initialFormData, selectedRowFormData]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleDelete = (e) => {
    e.preventDefault();
  };

  return (
    <Modal onModalHide={onFormHide} isModalDisplay={isModalDisplay}>
      <Row className="py-4 justify-content-center">
        <Col columnSize={["auto"]}>
          <h1 className="font-weight-bold">
            {type === "create" ? `Add new ${formName}` : `Edit the ${formName}`}
          </h1>
        </Col>
      </Row>
      <hr className="navbar-divider"></hr>
      <form className="form" autoComplete="off">
        <FormContent />
        <hr className="navbar-divider"></hr>
        <Row className="justify-content-center mt-5">
          <Col columnSize={["12"]}>
            <Button
              bgHoverColor="#0049c7"
              className="px-4 py-3 w-100"
              type="submit"
              onClick={isSfaffFormChanged ? handleSubmit : undefined}
              disabled={!isSfaffFormChanged}
            >
              {type === "create" ? `Add new ` : `Submit changes `}
              <SpinnerCircular size={14} className="ml-2" color="white" />
            </Button>
          </Col>
        </Row>
        {type === "edit" && (
          <Row className="justify-content-center mt-5">
            <Col columnSize={["12"]}>
              <Button
                bgColor="#ff4949"
                bgHoverColor="#ff0000"
                className="px-4 py-3 w-100"
                onClick={handleDelete}
              >
                {`Commit delete `}
                <SpinnerCircular size={14} className="ml-2" color="white" />
              </Button>
            </Col>
          </Row>
        )}
      </form>
    </Modal>
  );
}

RightSideFormModal.propTypes = {
  formName: PropTypes.string,
  model: PropTypes.func,
  requiredFields: PropTypes.arrayOf(PropTypes.string),
  readOnlyFields: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.oneOf(["create", "edit"]).isRequired,
  isModalDisplay: PropTypes.bool,
  onFormHide: PropTypes.func,
};

export default RightSideFormModal;
