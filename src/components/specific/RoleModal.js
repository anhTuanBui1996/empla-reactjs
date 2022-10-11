import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Modal from "../common/Modal";
import Row from "../layout/Row";
import Col from "../layout/Col";
import Select from "react-select";
import Button from "../common/Button";
import FileUploader from "./FileUploader";
import DatePicker from "./DatePicker";
import { VALIDATE_RULE } from "../../constants";
import { initialErrorFormForRole } from "../../assets/errors/errorForStaffModal";
import {
  initialRoleFormForCreate,
  initialRoleFormForEdit,
} from "../../assets/forms/roleForm";
import { optionList } from "../../assets/options/roleOptionSelects";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  selectIsSuccess,
  selectError,
  selectOptionList,
  fetchAllEmptySelectList,
} from "../../features/selectListSlice";
import {
  selectProgressing as progressingRole,
  selectError as errorRole,
  setSelectedRoleForEdit,
  selectSelectedRoleForEdit,
  deleteExistingRole,
  selectDeletedRoleData,
  retrieveRoleList,
  setWillBeUpdatedRoleData,
  selectWillBeUpdatedRoleData,
  setWillUpdatingRoleData,
  selectWillUpdatingRoleData,
  selectNewRoleData,
} from "../../features/roleSlice";
import { SpinnerCircular } from "spinners-react";
import { compareTwoArrayOfString } from "../../utils/arrayUtils";
import {
  createNewLog,
  selectLogsData,
  setLogsData,
} from "../../features/logsSlice";
import { getLocalUser } from "../../services/localStorage.service";
import { compareTwoObject } from "../../utils/objectUtils";

// NOTE: The Select component (from react-select) that doesn't
// support custom inner props when using component event listener
// (the event object doesn't contains the custom props), so we use
// className props to define the table(data-table) and the field
// name(name) to that Select component (syntax: "<data-table> <name>"),
// the normal input form-control still can use the custom props data-table
// and name.

function RoleModal({ isModalDisplay, type, setModalHide }) {
  const [componentAvailable, setComponentAvailable] = useState(true);
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  // watch retrieve status of select list for options of <Select>
  const retrieveSelectStatus = useSelector(selectIsSuccess);
  const retrieveSelectResult = useSelector(selectOptionList);
  const retrieveSelectError = useSelector(selectError);
  // watch error of redux async thunk progression
  const roleError = useSelector(errorRole);
  // watch status of redux async thunk progression
  const roleProgression = useSelector(progressingRole);

  const logData = useSelector(selectLogsData);

  const createdRole = useSelector(selectNewRoleData);

  const selectedRoleForEdit = useSelector(selectSelectedRoleForEdit);

  // the fields with old value of selected record will be updated
  const willBeUpdatedRole = useSelector(selectWillBeUpdatedRoleData);
  // the fields with new value of selected record will updating to
  const willUpdatingRole = useSelector(selectWillUpdatingRoleData);

  const deletedRole = useSelector(selectDeletedRoleData);

  // all the input form below must have this 2 properties
  // (name, data-table)

  // define the select list use for dropdown form control,
  // empty select lists have to retrieve data from Airtable
  const [selectList, setSelectList] = useState(optionList);

  // define the data object that used for display and upload to
  // airtable the key name is the looked up value (read-only)
  // the 'linkedField' property is the actual field that
  // the new record will be add by this linkedField,
  // the field key and the linkedField is looked up field if
  // they are the same
  const [newRoleForm, setNewRoleForm] = useState({
    ...initialRoleFormForCreate,
  });
  // define this for comparing value when editting
  // if the value has been changed after a handleRoleInput,
  // enable the Submit Changes button, this is the initial form
  // every changing/modifying is happened in newRoleForm
  const [newRoleFormForEdit, setNewRoleFormForEdit] = useState(
    initialRoleFormForEdit
  );
  const [isSfaffFormChanged, setSubmitChangeStatus] = useState(false);

  // define the error status and message
  // initialErrorFormForRole is defined in constants.js
  const [errorForm, setErrorForm] = useState(initialErrorFormForRole);

  // define the ref list (used for validate error and focus to)
  const refList = {
    RoleName: useRef(null),
  };

  // retrieve data from airtable into empty select list
  useEffect(() => {
    if (retrieveSelectResult) {
      componentAvailable && setSelectList(retrieveSelectResult);
    } else {
      if (retrieveSelectStatus) {
        if (retrieveSelectError) {
          console.log(retrieveSelectError);
        }
      } else {
        dispatch(fetchAllEmptySelectList(selectList));
      }
    }
    return () => {
      setComponentAvailable(false);
    };
    // eslint-disable-next-line
  }, [
    componentAvailable,
    dispatch,
    retrieveSelectStatus,
    retrieveSelectResult,
    retrieveSelectError,
  ]);
  // Handle the input change (valitdate right after the input change)
  // Normal input/select handle
  const handleRoleInput = (e, action) => {
    setSubmitChangeStatus(false);
    if (e === null) {
      // when clearing a single select input
      setNewRoleForm((state) => {
        const { "data-table": dataTable, name } = action.removedValues[0];
        const newState = { ...state };
        newState[dataTable][name].value = "";
        newState[dataTable][name].label = "";
        return newState;
      });
      // handle compare changes
      setSubmitChangeStatus(true);
      return;
    } else if (typeof e === "object") {
      if (e.target) {
        setNewRoleForm((state) => {
          let dataTable = "";
          let name = "";
          let value = "";
          let label = "";
          if (e.target.dataset) {
            // used for normal input
            dataTable = e.target.dataset.table;
            name = e.target.name;
            value = e.target.value;
            label = e.target.value;
          } else if (e.inputType && e.inputType === "DatePicker") {
            // used for DatePicker input
            dataTable = e.target["data-table"];
            name = e.target.name;
            value = e.target.value;
            label = e.target.label;
          }
          const newState = { ...state };
          newState[dataTable][name].value = value;
          newState[dataTable][name].label = label;
          // handle compare changes
          if (newRoleFormForEdit[dataTable][name].value !== value) {
            setSubmitChangeStatus(true);
          }
          // ...
          return newState;
        });
      } else if (e.filesFailed && e.filesUploaded) {
        // used for image upload (Filestack handler)
        // filesFailed, filesUploaded are arrays
        if (e.filesUploaded.length) {
          setNewRoleForm((state) => {
            let newState = { ...state };
            const { name, "data-table": dataTable, filesUploaded } = e;
            newState[dataTable][name].value = [
              {
                filename: filesUploaded[0].filename,
                url: filesUploaded[0].url,
              },
            ];
            newState[dataTable][name].label = filesUploaded[0].url;
            // handle compare changes
            if (
              newRoleFormForEdit[dataTable][name].label !== filesUploaded[0].url
            ) {
              setSubmitChangeStatus(true);
            }
            return newState;
          });
        } else {
          if (e.filesFailed.length) {
            // image upload failed
            console.log("image upload failed", e);
          } else {
            // clear image from newRoleForm
            setNewRoleForm((state) => {
              let newState = { ...state };
              const { name, "data-table": dataTable } = e;
              newState[dataTable][name].value = [];
              newState[dataTable][name].label = "";
              return newState;
            });
            // handle compare changes
            setSubmitChangeStatus(true);
          }
        }
      } else {
        setNewRoleForm((state) => {
          // used for select input
          let newState = { ...state };
          if (Array.isArray(e)) {
            // multi select
            let refObj = {};
            switch (action.action) {
              case "clear":
                refObj = action.removedValues[0];
                break;
              case "remove-value":
                refObj = action.removedValue;
                break;
              default:
                refObj = action.option;
                break;
            }
            const { "data-table": dataTable, name } = refObj;
            const newSelectedValue = [];
            const newSelectedLabel = [];
            e.forEach((selectItem) => {
              const { value, label } = selectItem;
              newSelectedValue.push(value);
              newSelectedLabel.push(label);
            });
            newState[dataTable][name].value = newSelectedValue;
            newState[dataTable][name].label = newSelectedLabel;
            // handle compare changes
            if (
              !compareTwoArrayOfString(
                newRoleFormForEdit[dataTable][name].value,
                newSelectedValue
              )
            ) {
              setSubmitChangeStatus(true);
            }
          } else {
            // single select
            const newState = { ...state };
            const { "data-table": dataTable, name, value, label } = e;
            if (newRoleForm[dataTable][name].linkedField === name) {
              // pure single select
              newState[dataTable][name].value = value;
              if (newRoleFormForEdit[dataTable][name].value !== value) {
                setSubmitChangeStatus(true);
              }
            } else {
              // looked up/linked field
              newState[dataTable][name].value = [value];
              if (newRoleFormForEdit[dataTable][name].value[0] !== value[0]) {
                setSubmitChangeStatus(true);
              }
            }
            newState[dataTable][name].label = label;
          }
          return newState;
        });
      }
    }
    handleValidate();
  };

  // validate the newRoleForm
  const handleValidate = () => {
    // define the validator for the form
    setErrorForm((state) => {
      let newErr = { ...state };
      newErr.errStatus = false;
      Object.keys(newErr.errMsg).forEach((tableKey) => {
        Object.keys(newErr.errMsg[tableKey]).forEach((fieldKey) => {
          newErr.errMsg[tableKey][fieldKey] = "";
        });
      });
      const roleForm = newRoleForm;
      // RoleName
      if (roleForm.RoleName.value === "") {
        newErr.errMsg.RoleName = "The Role Name is mustn't empty";
        newErr.errStatus = true;
      } else {
        const roleNameRule = VALIDATE_RULE.roleName;
        const roleNameVal = roleForm.RoleName.value;
        if (roleNameVal.length < roleNameRule.minLength) {
          newErr.errMsg.RoleName = "The Role Name length's must higher than 3";
          newErr.errStatus = true;
        }
      }
      // ...
      return newErr;
    });
  };

  // handle retrieve tables after a create/update/delete
  const handleRetrieveRoleTable = () => {
    dispatch(retrieveRoleList());
  };

  // handle submit the new role creation or update role info
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errorForm.errStatus) {
      setErrorForm({ ...errorForm, isShowMsg: true });
      let findFirstErrRef = false;
      Object.values(errorForm.errMsg).forEach((tableErrObj) => {
        if (findFirstErrRef) return;
        for (const fieldKey in tableErrObj) {
          if (tableErrObj[fieldKey] !== "") {
            refList[fieldKey]?.current.scrollIntoView();
            findFirstErrRef = true;
            return;
          }
        }
      });
      return;
    }
    // create new record object suitable with fields in airtable
    // this is the data to upload to airtable
    let newRecord = { Role: {}, Status: {}, Account: {} };
    // this is the old data that has been overwrited
    let oldRecord = { Role: {}, Status: {}, Account: {} };
    Object.keys(newRecord).forEach((tableKey) => {
      Object.entries(
        type === "create"
          ? newRoleFormForEdit[tableKey] // type === "create"
          : newRoleForm[tableKey] // type === "edit"
      ).forEach((field) => {
        if (type === "edit") {
          // exclude the field that can't be updated (duplicated/computed/empty)
          if (field[1].value === undefined) {
            return;
          } else if (Array.isArray(field[1].value)) {
            if (field[1].value.length === 0) {
              return;
            } else if (typeof field[1].value[0] === "object") {
              // comparing 2 Attachment type object (airtable)
              for (let j = 0; j < field[1].value.length; j++) {
                if (
                  compareTwoObject(
                    field[1].value[j],
                    newRoleFormForEdit[tableKey][field[0]].value[j]
                  )
                ) {
                  return;
                }
              }
            } else if (typeof field[1].value[0] === "string") {
              if (
                compareTwoArrayOfString(
                  field[1].value,
                  newRoleFormForEdit[tableKey][field[0]].value
                )
              ) {
                return;
              }
            }
          } else if (typeof field[1].value === "string") {
            if (
              field[1].value.length === 0 ||
              field[1].value === newRoleFormForEdit[tableKey][field[0]].value
            ) {
              return;
            }
          }
          oldRecord[tableKey][field[1].linkedField] =
            newRoleFormForEdit[tableKey][field[1].linkedField].value;
        }
        newRecord[tableKey][field[1].linkedField] = field[1].value;
      });
    });

    // save the old data to redux (available with Update action)
    dispatch(setWillBeUpdatedRoleData(oldRecord.Role));
  };

  // handle delete a role
  const handleDeleteRole = (e) => {
    e.preventDefault();
    const roleRecordId = selectedRoleForEdit.id;
    dispatch(deleteExistingRole(roleRecordId));
  };

  // handle finish task (create/update/delete)
  const handleFinishTask = () => {
    setModalHide();
    dispatch(setSelectedRoleForEdit(null));
    dispatch(setLogsData(null));
  };

  // effect catch the create/update/delete api
  // there are 3 prefix progression of 3 table
  // (<role>/<retrieve|create|update|delete>)
  // and a status behind (pending/rejected/fulfilled)
  // (ex. role/create/pending, status/update/rejected ,...)
  // added toast display
  // added logs creation
  useEffect(() => {
    // role progression
    switch (roleProgression) {
      case "role/create/rejected":
        console.error(roleError);
        dispatch(
          createNewLog({
            Actions: "Create",
            Account: getLocalUser().UserAccount,
            TableAffected: "Role",
            Status: "Failed",
            Notes: `Create a new Role errored,\n${JSON.stringify(roleError)}`,
          })
        );
        addToast("Fail to create a new role record!", {
          appearance: "error",
        });
        break;
      case "role/create/fulfilled":
        dispatch(
          createNewLog({
            Actions: "Create",
            Account: getLocalUser().UserAccount,
            RecordAffected: createdRole.id,
            TableAffected: "Role",
            Status: "Done",
            NewValue: JSON.stringify(createdRole.fields),
            Notes: "Create a new Role",
          })
        );
        addToast("Fail to create a new role record!", {
          appearance: "error",
        });
        break;
      case "role/update/rejected":
        console.error(roleError);
        dispatch(
          createNewLog({
            Actions: "Update",
            Account: getLocalUser().UserAccount,
            RecordAffected: willUpdatingRole.recordId,
            TableAffected: "Role",
            Status: "Failed",
            OldValue: JSON.stringify(willBeUpdatedRole),
            NewValue: JSON.stringify(willUpdatingRole.updateData),
            Notes: `Update an existing Role errored,\n${JSON.stringify(
              roleError
            )}`,
          })
        );
        addToast("Fail to update the role record!", {
          appearance: "error",
        });
        break;
      case "role/update/fulfilled":
        dispatch(
          createNewLog({
            Actions: "Update",
            Account: getLocalUser().UserAccount,
            RecordAffected: willUpdatingRole.recordId,
            TableAffected: "Role",
            Status: "Done",
            OldValue: JSON.stringify(willBeUpdatedRole),
            NewValue: JSON.stringify(willUpdatingRole.updateData),
            Notes: `Update an existing Role`,
          })
        );
        addToast("Update the role record successfully!", {
          appearance: "success",
        });
        handleRetrieveRoleTable();
        break;
      case "role/delete/rejected":
        console.log(roleError);
        dispatch(
          createNewLog({
            Actions: "Delete",
            Account: getLocalUser().UserAccount,
            RecordAffected: selectedRoleForEdit.id,
            TableAffected: "Role",
            Status: "Failed",
            Notes: `Delete an existing Role errored,\n${JSON.stringify(
              roleError
            )}`,
          })
        );
        addToast("Fail to delete the role record!", {
          appearance: "error",
        });
        break;
      case "role/delete/fulfilled":
        dispatch(
          createNewLog({
            Actions: "Delete",
            Account: getLocalUser().UserAccount,
            RecordAffected: deletedRole.id,
            TableAffected: "Role",
            Status: "Done",
            OldValue: JSON.stringify(deletedRole.fields),
            Notes: `Delete an existing Role `,
          })
        );
        addToast("Delete the role record successfully!", {
          appearance: "success",
        });
        handleRetrieveRoleTable();
        break;
      default:
        break;
    }
    // eslint-disable-next-line
  }, [roleProgression]);

  // logs listener, finish task when the log has been created
  useEffect(() => {
    if (logData) {
      handleFinishTask();
      dispatch(setWillBeUpdatedRoleData(null));
      dispatch(setWillUpdatingRoleData(null));
    }
    // eslint-disable-next-line
  }, [logData]);

  // update the modal initial state (newRoleForm)
  // when select a role to edit or clear role when click Add new role
  useEffect(() => {
    // for edit (see the initial value in forms)
    const setNewRole = (state) => {
      let newState = { ...state };
      // set for Role
      Object.entries(newState.Role).forEach((formField) => {
        const valueOfFieldsSelected = selectedRoleForEdit.fields[formField[0]];
        // currently we only set value base on retrive data type (not field type)
        // will need to modify here in the future
        if (formField[0] === formField[1].linkedField) {
          if (Array.isArray(valueOfFieldsSelected)) {
            // array of attachment
            newState.Role[formField[0]].value = valueOfFieldsSelected;
            newState.Role[formField[0]].label = valueOfFieldsSelected[0].url;
          } else {
            // string text value or single select
            newState.Role[formField[0]].value = valueOfFieldsSelected;
            newState.Role[formField[0]].label = valueOfFieldsSelected;
          }
        } else {
          // linked field and looked up field
          newState.Role[formField[0]].value =
            selectedRoleForEdit.fields[formField[1].linkedField];
          newState.Role[formField[0]].label = valueOfFieldsSelected;
        }
      });
      return newState;
    };
    // for create (see initial value in forms)
    const resetNewRole = (state) => {
      let newState = { ...state };
      Object.keys(newState).forEach((tableKey) => {
        Object.keys(newState[tableKey]).forEach((fieldKey) => {
          switch (newState[tableKey][fieldKey].fieldType) {
            case "singleLineText":
              break;
            case "longText":
              break;
            case "attachment":
              break;
            case "singleSelect":
              break;
            case "multipleSelect":
              break;
            case "checkbox":
              break;
            case "date":
              break;
            case "linkToAnotherRecord":
              break;
            default:
              console.error("There is new field type that hasn't defined yet", `${tableKey}.${fieldKey}`);
              break;
          }
        });
      });
      return newState;
    };
    const resetError = (state) => {
      let newState = { ...state };
      newState.errStatus = false;
      newState.isShowMsg = false;
      Object.keys(newState.errMsg).forEach((tableKey) => {
        Object.keys(newState.errMsg[tableKey]).forEach((fieldKey) => {
          newState.errMsg[tableKey][fieldKey] = "";
        });
      });
      return newState;
    };
    if (selectedRoleForEdit) {
      // reset newRoleForm state, see the initialRoleFormForEdit
      setNewRoleForm(setNewRole);
      setNewRoleFormForEdit(setNewRole);
      // reset errorForm state, see the initialErrorFormForRole
      setErrorForm(resetError);
    } else {
      // reset newRoleForm state, see the initialRoleFormForCreate
      setNewRoleForm(resetNewRole);
      setNewRoleFormForEdit(resetNewRole);
      // reset errorForm state, see the initialErrorFormForRole
      setErrorForm(resetError);
    }
    setSubmitChangeStatus(false);
    // eslint-disable-next-line
  }, [selectedRoleForEdit]);

  return (
    <Modal onModalHide={setModalHide} isModalDisplay={isModalDisplay}>
      <Row className="py-4 justify-content-center">
        <Col columnSize={["auto"]}>
          <h1 className="font-weight-bold">
            {type === "create" ? "Add new role" : "Edit the role"}
          </h1>
        </Col>
      </Row>
      {/* Single line text */}
      <hr className="navbar-divider"></hr>
      <form className="form">
        <div className="form-group">
          <label htmlFor="RoleName" ref={refList.RoleName}>
            Role name <span className="text-danger">*</span>
          </label>
          <input
            name="RoleName"
            data-table="Role"
            className="form-control"
            type="text"
            value={newRoleForm.Role.RoleName.label}
            onChange={handleRoleInput}
            onBlur={handleValidate}
            placeholder="Enter role name..."
          />
          {errorForm.errMsg.RoleName !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.RoleName}
            </div>
          )}
        </div>
        {/* Single select */}
        <div className="form-group">
          <label htmlFor="Gender" ref={refList.Gender}>
            Gender <span className="text-danger">*</span>
          </label>
          <Select
            className="Role Gender"
            onChange={handleRoleInput}
            onBlur={handleValidate}
            value={
              newRoleForm.Role.Gender.value && {
                "data-table": "Role",
                label: newRoleForm.Role.Gender.label,
                value: newRoleForm.Role.Gender.value,
                name: "Gender",
              }
            }
            options={selectList.Role.Gender.list}
            placeholder="Select gender..."
            isClearable
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
          {errorForm.errMsg.Gender !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.Gender}
            </div>
          )}
        </div>
        {/* Checkbox */}
        <div className="form-group">
          <div class="custom-control custom-switch">
            <label class="custom-control-label" for="database-accessibility">
              Database Accessibility
            </label>
            <input
              type="checkbox"
              class="custom-control-input Role DatabaseAccessibility"
              id="database-accessibility"
            />
          </div>
        </div>
        {/* Attachment */}
        <div className="form-group">
          <label htmlFor="Portrait">Portrait</label>
          <FileUploader
            name="Portrait"
            data-table="Role"
            imgData={newRoleForm.Role.Portrait.value}
            handleUploadSuccessfully={handleRoleInput}
            handleClearImg={handleRoleInput}
          />
        </div>
        {/* Date */}
        <div className="form-group">
          <label htmlFor="DOB" ref={refList.DOB}>
            Day of birth <span className="text-danger">*</span>
          </label>
          <DatePicker
            className="form-control"
            name="DOB"
            data-table="Role"
            value={newRoleForm.DOB.value && newRoleForm.DOB.label}
            onChange={handleRoleInput}
            onBlur={handleValidate}
          />
          {errorForm.errMsg.DOB !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.DOB}
            </div>
          )}
        </div>
        {/* ... */}
        <hr className="navbar-divider"></hr>
        {/* Buttons submit and delete */}
        <Row className="justify-content-center mt-5">
          <Col columnSize={["12"]}>
            <Button
              className="px-4 py-3 w-100"
              type="submit"
              onClick={isSfaffFormChanged ? handleSubmit : undefined}
              disabled={!isSfaffFormChanged}
            >
              {type === "create" ? "Add new role" : "Submit changes"}
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
                onClick={handleDeleteRole}
              >
                Delete this role
              </Button>
            </Col>
          </Row>
        )}
      </form>
    </Modal>
  );
}

RoleModal.propTypes = {
  isModalDisplay: PropTypes.bool,
  type: PropTypes.oneOf(["create", "edit"]).isRequired,
  setModalHide: PropTypes.func,
  setModalType: PropTypes.func,
};

export default RoleModal;
