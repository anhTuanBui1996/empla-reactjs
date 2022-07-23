import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Modal from "../common/Modal";
import Row from "../layout/Row";
import Col from "../layout/Col";
import Select from "react-select";
import Button from "../common/Button";
import ImageUploader from "./ImageUploader";
import DatePicker from "./DatePicker";
import { VALIDATE_RULE } from "../../constants";
import {
  initialErrorFormForRole,
  initialRoleFormForCreate,
  initialRoleFormForEdit,
  optionList,
} from "../../features/roleModal";
import useAutoGenerate from "../hooks/useAutoGenerate";
import { MdRefresh, MdRemoveRedEye } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  fetchAllEmptySelectList,
  selectError,
  selectIsSuccess,
  selectOptionList,
} from "../../features/selectListSlice";
import {
  setSelectedRoleForEdit,
  selectSelectedRoleForEdit,
  setLoading,
  setNewRoleData,
  updateExistingRole,
  selectError as errorRole,
  deleteExistingRole,
  selectProgressing as progressingRole,
  retrieveRoleList,
  selectDeletedRoleData,
  selectWillUpdatingRoleData,
  setWillBeUpdatedRoleData,
  selectWillBeUpdatedRoleData,
  setWillUpdatingRoleData,
  selectNewRoleData,
} from "../../features/roleSlice";
import { SpinnerCircular } from "spinners-react";
import convertFullNameToUsername from "../../utils/convertToUsername";
import { createNewRecord } from "../../services/airtable.service";
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
  let [componentAvailable, setComponentAvailable] = useState(true);
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const logData = useSelector(selectLogsData);

  const createdRole = useSelector(selectNewRoleData);

  const selectedRoleForEdit = useSelector(selectSelectedRoleForEdit);

  // all the input form below must have this 2 properties
  // (name, data-table)

  // define the select list use for dropdown form control,
  // empty select lists have to retrieve data from Airtable
  // optionList is defined in features/roleModal.js
  const [selectList, setSelectList] = useState(optionList);

  // define the data object that used for display and upload to
  // airtable the key name is the looked up value (read-only)
  // the 'linkedField' property is the actual field that
  // the new record will be add by this linkedField,
  // the field key and the linkedField is looked up field if
  // they are the same
  // initialRoleFormForCreate is defined in constants.js
  // added Password generation
  const [newRoleForm, setNewRoleForm] = useState({
    ...initialRoleFormForCreate
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

  // define the ref list
  const refList = {
    FullName: useRef(null),
    Gender: useRef(null),
    DOB: useRef(null),
    Phone: useRef(null),
    Company: useRef(null),
    WorkingType: useRef(null),
    WorkingStatus: useRef(null),
    StartWorkingDay: useRef(null),
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
          // handle Username generator
          if (name === "FullName") {
            setUsernameValidation(true);
            let newUsername = convertFullNameToUsername(value);
            const currentDomain = newState.Account.Domain.label;
            const filteredRecordSameUsername = accountDataTableList.filter(
              (record) => record.fields.Username.startsWith(newUsername)
            );
            if (filteredRecordSameUsername.length === 0) {
              newState.Account.Username.value = newUsername;
              newState.Account.Username.label = newUsername;
              newState.Account.UserAccount.value = newUsername + currentDomain;
              newState.Account.UserAccount.label = newUsername + currentDomain;
            } else if (
              filteredRecordSameUsername.length === 1 &&
              filteredRecordSameUsername[0].fields.Username === newUsername
            ) {
              newState.Account.Username.value = newUsername + 1;
              newState.Account.Username.label = newUsername + 1;
              newState.Account.UserAccount.value =
                newUsername + 1 + currentDomain;
              newState.Account.UserAccount.label =
                newUsername + 1 + currentDomain;
            } else {
              for (let i = 1; i <= filteredRecordSameUsername.length; i++) {
                const findUsername = filteredRecordSameUsername.find(
                  (record) => record.fields.Username === newUsername + i
                );
                if (findUsername !== undefined) {
                  newState.Account.Username.value = newUsername + i;
                  newState.Account.Username.label = newUsername + i;
                  newState.Account.UserAccount.value =
                    newUsername + i + currentDomain;
                  newState.Account.UserAccount.label =
                    newUsername + i + currentDomain;
                  break;
                }
                const findUsernameNext = filteredRecordSameUsername.find(
                  (record) => record.fields.Username === newUsername + (i + 1)
                );
                if (findUsernameNext !== undefined) {
                  newState.Account.Username.value = newUsername + (i + 1);
                  newState.Account.Username.label = newUsername + (i + 1);
                  newState.Account.UserAccount.value =
                    newUsername + (i + 1) + currentDomain;
                  newState.Account.UserAccount.label =
                    newUsername + (i + 1) + currentDomain;
                  break;
                }
              }
            }
            setUsernameValidation(false);
          }
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
              newRoleFormForEdit[dataTable][name].label !==
              filesUploaded[0].url
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
            const newState = { ...state };
            const { "data-table": dataTable, name, value, label } = e;
            // when chosing Company it will change the Username and Domain too
            if (name === "Company") {
              const username = newState.Account.Username;
              const domain = newState.Account.Domain;
              const userAccount = newState.Account.UserAccount;
              domain.value = [value];
              domain.label = selectList.Account.Domain.list.find(
                (item) => item.value === value
              ).label;
              userAccount.value = username.value + domain.value;
              userAccount.label = username.label + domain.label;
            }
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
      const roleForm = newRoleForm.Role;
      const statusForm = newRoleForm.Status;
      // FullName
      if (roleForm.FullName.value === "") {
        newErr.errMsg.Role.FullName = "The Full Name is mustn't empty";
        newErr.errStatus = true;
      } else {
        const fullNameRule = VALIDATE_RULE.fullName;
        const fullNameVal = roleForm.FullName.value;
        if (fullNameVal.length < fullNameRule.minLength) {
          newErr.errMsg.Role.FullName =
            "The Full Name length's must higher than 3";
          newErr.errStatus = true;
        } else if (fullNameVal.length > fullNameRule.maxLength) {
          newErr.errMsg.Role.FullName =
            "The Full Name length's must less than 31";
          newErr.errStatus = true;
        } else if (fullNameVal.match(fullNameRule.pattern) === null) {
          newErr.errMsg.Role.FullName = "The Full Name is invalid";
          newErr.errStatus = true;
        }
      }
      // Gender
      if (roleForm.Gender.value === "") {
        newErr.errMsg.Role.Gender = "The Gender is mustn't empty";
        newErr.errStatus = true;
      }
      // Date Of Birth
      if (roleForm.DOB.value === "") {
        newErr.errMsg.Role.DOB = "The DOB is mustn't empty";
        newErr.errStatus = true;
      }
      // Phone
      if (roleForm.Phone.value === "") {
        newErr.errMsg.Role.Phone = "The Phone is mustn't empty";
        newErr.errStatus = true;
      } else {
        const phoneRule = VALIDATE_RULE.phone;
        const phoneVal = roleForm.Phone.value;
        if (phoneVal.match(phoneRule.pattern) === null) {
          newErr.errMsg.Role.Phone = "The Phone nummber is invalid";
          newErr.errStatus = true;
        }
      }
      // Company
      if (roleForm.Company.value === "") {
        newErr.errMsg.Role.Company = "The Company is mustn't empty";
        newErr.errStatus = true;
      }
      // Working Type
      if (statusForm.WorkingType.value === "") {
        newErr.errMsg.Status.WorkingType = "The Working Type is mustn't empty";
        newErr.errStatus = true;
      }
      // Working Status
      if (statusForm.WorkingStatus.value === "") {
        newErr.errMsg.Status.WorkingStatus =
          "The Working Status is mustn't empty";
        newErr.errStatus = true;
      }
      // Start Working Day
      if (statusForm.StartWorkingDay.value === "") {
        newErr.errMsg.Status.StartWorkingDay =
          "The Start Working Day is mustn't empty";
        newErr.errStatus = true;
      }
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
            Notes: `Create a new Role errored,\n${JSON.stringify(
              roleError
            )}`,
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
      dispatch(setWillBeUpdatedStatusData(null));
      dispatch(setWillBeUpdatedAccountData(null));
      dispatch(setWillUpdatingRoleData(null));
      dispatch(setWillUpdatingStatusData(null));
      dispatch(setWillUpdatingAccountData(null));
    }
    // eslint-disable-next-line
  }, [logData]);

  // update the modal initial state (newRoleForm)
  // when select a role to edit or clear role when click Add new role
  useEffect(() => {
    const setNewRole = (state) => {
      let newState = { ...state };
      // set for Role
      Object.entries(newState.Role).forEach((formField) => {
        const valueOfFieldsSelected = selectedRoleForEdit.fields[formField[0]];
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
      Object.entries(newState.Status).forEach((formField) => {
        const valueOfFieldsSelected =
          selectedStatusForEdit.fields[formField[0]];
        if (formField[0] === formField[1].linkedField) {
          if (Array.isArray(valueOfFieldsSelected)) {
            if (valueOfFieldsSelected[0].url) {
              // array of attachment
              newState.Status[formField[0]].value = valueOfFieldsSelected;
              newState.Status[formField[0]].label =
                valueOfFieldsSelected[0].url;
            } else {
              // multi select
              newState.Status[formField[0]].value = valueOfFieldsSelected;
              newState.Status[formField[0]].label = valueOfFieldsSelected;
            }
          } else {
            // string text value or single select
            newState.Status[formField[0]].value = valueOfFieldsSelected;
            newState.Status[formField[0]].label = valueOfFieldsSelected;
          }
        } else {
          // linked field and looked up field
          newState.Status[formField[0]].value =
            selectedStatusForEdit.fields[formField[1].linkedField];
          newState.Status[formField[0]].label = valueOfFieldsSelected;
        }
      });
      Object.entries(newState.Account).forEach((formField) => {
        const valueOfFieldsSelected =
          selectedAccountForEdit.fields[formField[0]];
        if (formField[0] === formField[1].linkedField) {
          if (Array.isArray(valueOfFieldsSelected)) {
            // array of attachment
            newState.Account[formField[0]].value = valueOfFieldsSelected;
            newState.Account[formField[0]].label = valueOfFieldsSelected[0].url;
          } else {
            // string text value or single select
            newState.Account[formField[0]].value = valueOfFieldsSelected;
            newState.Account[formField[0]].label = valueOfFieldsSelected;
          }
        } else {
          // linked field and looked up field
          newState.Account[formField[0]].value =
            selectedAccountForEdit.fields[formField[1].linkedField];
          newState.Account[formField[0]].label = valueOfFieldsSelected;
        }
      });
      return newState;
    };
    const resetNewRole = (state) => {
      let newState = { ...state };
      Object.keys(newState).forEach((tableKey) => {
        Object.keys(newState[tableKey]).forEach((fieldKey) => {
          if (fieldKey === "Password") {
            const newPasswordGenerated = autoGenerate(12);
            newState[tableKey][fieldKey].value = newPasswordGenerated;
            newState[tableKey][fieldKey].label = newPasswordGenerated;
          } else {
            if (
              fieldKey === "Portrait" ||
              fieldKey === "Avatar" ||
              fieldKey === "Covid19VaccineType"
            ) {
              newState[tableKey][fieldKey].value = [];
            } else {
              newState[tableKey][fieldKey].value = "";
            }
            if (fieldKey === "Covid19VaccineType") {
              newState[tableKey][fieldKey].label = [];
            } else {
              newState[tableKey][fieldKey].label = "";
            }
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
    if (
      selectedRoleForEdit &&
      selectedStatusForEdit &&
      selectedAccountForEdit
    ) {
      setNewRoleForm(setNewRole);
      setNewRoleFormForEdit(setNewRole);
      // reset errorForm state, see the initialErrorFormForRole
      setErrorForm(resetError);
    } else {
      // reset newRoleForm state, see the initialRoleFormForCreate in constant.js
      setNewRoleForm(resetNewRole);
      setNewRoleFormForEdit(resetNewRole);
      // reset errorForm state, see the initialErrorFormForRole
      setErrorForm(resetError);
    }
    setSubmitChangeStatus(false);
    // eslint-disable-next-line
  }, [selectedRoleForEdit, selectedStatusForEdit, selectedAccountForEdit]);

  return (
    <Modal onModalHide={setModalHide} isModalDisplay={isModalDisplay}>
      <Row className="py-4 justify-content-center">
        <Col columnSize={["auto"]}>
          <h1 className="font-weight-bold">
            {type === "create" ? "Add new role" : "Edit the role"}
          </h1>
        </Col>
      </Row>
      <hr className="navbar-divider"></hr>
      <h3 className="font-weight-bold text-center">General Information</h3>
      <form className="form">
        <div className="form-group">
          <label htmlFor="FullName" ref={refList.FullName}>
            Full name <span className="text-danger">*</span>
          </label>
          <input
            name="FullName"
            data-table="Role"
            className="form-control"
            type="text"
            value={newRoleForm.Role.FullName.label}
            onChange={handleRoleInput}
            onBlur={handleValidate}
            placeholder="Enter full name..."
          />
          {errorForm.errMsg.Role.FullName !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.Role.FullName}
            </div>
          )}
        </div>
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
          {errorForm.errMsg.Role.Gender !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.Role.Gender}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="Portrait">Portrait</label>
          <ImageUploader
            name="Portrait"
            data-table="Role"
            imgData={newRoleForm.Role.Portrait.value}
            imgThumbnail={
              newRoleForm.Role.Portrait.value &&
              newRoleForm.Role.Portrait.label
            }
            handleUploadSuccessfully={handleRoleInput}
            handleClearImg={handleRoleInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="DOB" ref={refList.DOB}>
            Day of birth <span className="text-danger">*</span>
          </label>
          <DatePicker
            className="form-control"
            name="DOB"
            data-table="Role"
            value={newRoleForm.Role.DOB.value && newRoleForm.Role.DOB.label}
            onChange={handleRoleInput}
            onBlur={handleValidate}
          />
          {errorForm.errMsg.Role.DOB !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.Role.DOB}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="Phone" ref={refList.Phone}>
            Phone number <span className="text-danger">*</span>
          </label>
          <input
            name="Phone"
            data-table="Role"
            className="form-control"
            type="tel"
            value={
              newRoleForm.Role.Phone.value && newRoleForm.Role.Phone.label
            }
            onChange={handleRoleInput}
            onBlur={handleValidate}
            placeholder="0123 456 789"
          />
          {errorForm.errMsg.Role.Phone !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.Role.Phone}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="PersonalEmail">Personal email</label>
          <input
            name="PersonalEmail"
            data-table="Role"
            className="form-control"
            value={
              newRoleForm.Role.PersonalEmail.value &&
              newRoleForm.Role.PersonalEmail.label
            }
            type="email"
            onChange={handleRoleInput}
            onBlur={handleValidate}
            placeholder="example@foo.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="Company" ref={refList.Company}>
            Company <span className="text-danger">*</span>
          </label>
          <Select
            className="Role Company"
            onChange={handleRoleInput}
            onBlur={handleValidate}
            value={
              newRoleForm.Role.Company.value && {
                "data-table": "Role",
                label: newRoleForm.Role.Company.label,
                value: newRoleForm.Role.Company.value,
                name: "Company",
              }
            }
            options={selectList.Role.Company.list}
            placeholder="Who to work for..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
          {errorForm.errMsg.Role.Company !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.Role.Company}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="CurrentWorkingPlace">Working Place</label>
          <Select
            className="Role CurrentWorkingPlace"
            onChange={handleRoleInput}
            onBlur={handleValidate}
            value={
              newRoleForm.Role.CurrentWorkingPlace.value && {
                "data-table": "Role",
                label: newRoleForm.Role.CurrentWorkingPlace.label,
                value: newRoleForm.Role.CurrentWorkingPlace.value,
                name: "CurrentWorkingPlace",
              }
            }
            options={selectList.Role.CurrentWorkingPlace.list}
            placeholder="Where to work..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="RoleType">Role</label>
          <Select
            className="Role RoleType"
            onChange={handleRoleInput}
            onBlur={handleValidate}
            value={
              newRoleForm.Role.RoleType.value && {
                "data-table": "Role",
                label: newRoleForm.Role.RoleType.label,
                value: newRoleForm.Role.RoleType.value,
                name: "RoleType",
              }
            }
            options={selectList.Role.RoleType.list}
            placeholder="Working as a/an..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
        </div>
        <hr className="navbar-divider"></hr>
        <h3 className="font-weight-bold text-center">Employee Status</h3>
        <div className="form-group">
          <label htmlFor="WorkingType" ref={refList.WorkingType}>
            Working Type <span className="text-danger">*</span>
          </label>
          <Select
            className="Status WorkingType"
            onChange={handleRoleInput}
            onBlur={handleValidate}
            value={
              newRoleForm.Status.WorkingType.value && {
                "data-table": "Status",
                label: newRoleForm.Status.WorkingType.label,
                value: newRoleForm.Status.WorkingType.value,
                name: "WorkingType",
              }
            }
            options={selectList.Status.WorkingType.list}
            placeholder="Working type..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
          {errorForm.errMsg.Status.WorkingType !== "" &&
            errorForm.isShowMsg && (
              <div className="err-text text-danger mt-1">
                {errorForm.errMsg.Status.WorkingType}
              </div>
            )}
        </div>
        <div className="form-group">
          <label htmlFor="WorkingStatus" ref={refList.WorkingStatus}>
            Working Status <span className="text-danger">*</span>
          </label>
          <Select
            className="Status WorkingStatus"
            onChange={handleRoleInput}
            onBlur={handleValidate}
            value={
              newRoleForm.Status.WorkingStatus.value && {
                "data-table": "Status",
                label: newRoleForm.Status.WorkingStatus.label,
                value: newRoleForm.Status.WorkingStatus.value,
                name: "WorkingType",
              }
            }
            options={selectList.Status.WorkingStatus.list}
            placeholder="Working status..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
          {errorForm.errMsg.Status.WorkingStatus !== "" &&
            errorForm.isShowMsg && (
              <div className="err-text text-danger mt-1">
                {errorForm.errMsg.Status.WorkingStatus}
              </div>
            )}
        </div>
        <div className="form-group">
          <label htmlFor="StartWorkingDay" ref={refList.StartWorkingDay}>
            Start Working Day <span className="text-danger">*</span>
          </label>
          <DatePicker
            className="form-control"
            name="StartWorkingDay"
            data-table="Status"
            value={
              newRoleForm.Status.StartWorkingDay.value &&
              newRoleForm.Status.StartWorkingDay.label
            }
            onChange={handleRoleInput}
            onBlur={handleValidate}
          />
          {errorForm.errMsg.Status.StartWorkingDay !== "" &&
            errorForm.isShowMsg && (
              <div className="err-text text-danger mt-1">
                {errorForm.errMsg.Status.StartWorkingDay}
              </div>
            )}
        </div>
        <div className="form-group">
          <label htmlFor="MarriageStatus">Marriage Status</label>
          <Select
            className="Status MarriageStatus"
            onChange={handleRoleInput}
            onBlur={handleValidate}
            value={
              newRoleForm.Status.MarriageStatus.value && {
                "data-table": "Status",
                label: newRoleForm.Status.MarriageStatus.label,
                value: newRoleForm.Status.MarriageStatus.value,
                name: "MarriageStatus",
              }
            }
            options={selectList.Status.MarriageStatus.list}
            placeholder="Marriage status..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="HealthStatus">Health Status</label>
          <Select
            className="Status HealthStatus"
            onChange={handleRoleInput}
            onBlur={handleValidate}
            value={
              newRoleForm.Status.HealthStatus.value && {
                "data-table": "Status",
                label: newRoleForm.Status.HealthStatus.label,
                value: newRoleForm.Status.HealthStatus.value,
                name: "HealthStatus",
              }
            }
            options={selectList.Status.HealthStatus.list}
            placeholder="Health status..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Notes">Notes</label>
          <textarea
            name="Notes"
            data-table="Status"
            className="form-control"
            value={
              newRoleForm.Status.Notes.value && newRoleForm.Status.Notes.label
            }
            onChange={handleRoleInput}
            onBlur={handleValidate}
            placeholder="Notes..."
            style={{
              resize: "none",
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Covid19Vaccinated">Having vaccinated Covid-19?</label>
          <Select
            className="Status Covid19Vaccinated"
            onChange={handleRoleInput}
            onBlur={handleValidate}
            value={
              newRoleForm.Status.Covid19Vaccinated.value && {
                "data-table": "Status",
                label: newRoleForm.Status.Covid19Vaccinated.label,
                value: newRoleForm.Status.Covid19Vaccinated.value,
                name: "Covid19Vaccinated",
              }
            }
            options={selectList.Status.Covid19Vaccinated.list}
            placeholder="0/1/2 vaccinated..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Covid19VaccineType">Vaccine Type</label>
          <Select
            className="Status Covid19VaccineType"
            onChange={handleRoleInput}
            onBlur={handleValidate}
            isMulti
            value={
              newRoleForm.Status.Covid19VaccineType.value &&
              newRoleForm.Status.Covid19VaccineType.value.map(
                (value, index) => {
                  return {
                    "data-table": "Status",
                    label: newRoleForm.Status.Covid19VaccineType.label[index],
                    value,
                    name: "Covid19VaccineType",
                  };
                }
              )
            }
            options={selectList.Status.Covid19VaccineType.list}
            placeholder="Which type vaccine..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
        </div>
        <hr className="navbar-divider"></hr>
        <h3 className="font-weight-bold text-center">Account Information</h3>
        <div className="form-group">
          <label htmlFor="Username">Username</label>
          <span name="Username" data-table="Account" className="form-control">
            {newRoleForm.Account.Username.label}
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="Domain">Domain</label>
          <span name="Domain" data-table="Account" className="form-control">
            {newRoleForm.Account.Domain.label}
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="UserAccount">User Account</label>
          <span
            name="UserAccount"
            data-table="Account"
            className="form-control"
          >
            {newRoleForm.Account.UserAccount.label}
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="Password">Password</label>
          <div className="input-group input-group-merge">
            <input
              name="Password"
              autoComplete="none"
              data-table="Account"
              className="form-control form-control-appended"
              type={showPassword ? "text" : "password"}
              value={newRoleForm.Account.Password.label}
              disabled
              readOnly
            />
            <div className="input-group-append">
              <div className="input-group-text">
                <MdRefresh
                  onClick={() => generateNewPassword(12)}
                  style={{ cursor: "pointer" }}
                />
                <MdRemoveRedEye
                  color={showPassword ? "blue" : "grey"}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer", marginLeft: "5px" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="AccountStatus">Account Status</label>
          <Select
            className="Account AccountStatus"
            onChange={handleRoleInput}
            onBlur={handleValidate}
            value={
              newRoleForm.Account.AccountStatus.value && {
                "data-table": "Account",
                label: newRoleForm.Account.AccountStatus.label,
                value: newRoleForm.Account.AccountStatus.value,
                name: "AccountStatus",
              }
            }
            options={selectList.Account.AccountStatus.list}
            placeholder="Account status..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Avatar">Avatar</label>
          <ImageUploader
            name="Avatar"
            data-table="Account"
            imgData={newRoleForm.Account.Avatar.value}
            imgThumbnail={
              newRoleForm.Account.Avatar.value &&
              newRoleForm.Account.Avatar.label
            }
            handleUploadSuccessfully={handleRoleInput}
            handleClearImg={handleRoleInput}
          />
        </div>
        <hr className="navbar-divider"></hr>
        <Row className="justify-content-center mt-5">
          <Col columnSize={["12"]}>
            <Button
              className="px-4 py-3 w-100"
              type="submit"
              onClick={isSfaffFormChanged ? handleSubmit : undefined}
              disabled={usernameValidation || !isSfaffFormChanged}
            >
              {usernameValidation && <SpinnerCircular />}
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
                {usernameValidation && <SpinnerCircular />}
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
