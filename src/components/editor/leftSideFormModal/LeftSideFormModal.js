import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import Modal from "../../common/Modal";
import Row from "../../layout/Row";
import Col from "../../layout/Col";
import Button from "../../common/Button";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { SpinnerCircular } from "spinners-react";
import { selectFormData } from "../../../features/editorSlice";
import { parseFieldName } from "../../../utils/stringUtils";
import { selectMetadata } from "../../../features/metadataSlice";
import Text from "../leftSideFormModal/FormControl/Text";
import TextArea from "../leftSideFormModal/FormControl/TextArea";

function LeftSideFormModal({
  formName,
  model,
  requiredFields,
  type,
  isModalDisplay,
  onFormHide,
}) {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const editorFormData = useSelector(selectFormData);
  const fieldSet = useMemo(() => {
    if (editorFormData) {
      return new model(editorFormData.fields);
    }
    return new model();
  }, [editorFormData]);

  // Form State
  const [isSfaffFormChanged, setIsSfaffFormChanged] = useState(false);

  // Get the metadata of base
  const baseMetadata = useSelector(selectMetadata);
  const tableMetadata = baseMetadata.tables.find(
    (table) => table.name === formName
  );

  // Fill to the form content
  const FormContent = () => {
    return Object.entries(fieldSet).map((field) => {
      let formControl = null;

      let fieldName = field[0];
      let fieldValue = field[1];
      let fieldType = tableMetadata?.type;
      let fieldLable = parseFieldName(fieldName);
      let isRequiredField = requiredFields.indexOf(fieldName) !== -1;
      switch (fieldType) {
        case "singleLineText":
          formControl = (
            <Text
              name={fieldName}
              label={fieldLable}
              isRequired={isRequiredField}
              value={fieldValue}
            />
          );
          break;
        case "multilineText":
          formControl = (
            <TextArea
              name={fieldName}
              label={fieldLable}
              isRequired={isRequiredField}
              value={fieldValue}
            />
          );
          break;
        default:
          console.error(`New field type detected: ${fieldType}`);
          break;
      }

      return formControl;
    });
  };

  // const optionList = tables
  //   ?.find((tableItem) => tableItem.name === table)
  //   ?.fields.find((fieldItem) => fieldItem.name === name)
  //   ?.options.map((opt) => ({
  //     label: opt.name,
  //     value: opt.name,
  //     color: opt.color,
  //   }));

  const handleSubmit = () => {};
  const handleDelete = () => {};

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
      <form className="form">
        <FormContent />
        <hr className="navbar-divider"></hr>
        <Row className="justify-content-center mt-5">
          <Col columnSize={["12"]}>
            <Button
              className="px-4 py-3 w-100"
              type="submit"
              onClick={isSfaffFormChanged ? handleSubmit : undefined}
              disabled={!isSfaffFormChanged}
            >
              <SpinnerCircular />
              {type === "create" ? "Add new" : "Submit changes"}
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
                <SpinnerCircular />
                Commit delete
              </Button>
            </Col>
          </Row>
        )}
      </form>
    </Modal>
  );
}

LeftSideFormModal.propTypes = {
  formName: PropTypes.string,
  model: PropTypes.func,
  requiredFields: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.oneOf(["create", "edit"]).isRequired,
  isModalDisplay: PropTypes.bool,
  onFormHide: PropTypes.func,
};

export default LeftSideFormModal;
