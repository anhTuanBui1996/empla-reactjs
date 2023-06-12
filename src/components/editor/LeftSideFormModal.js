import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Modal from "../common/Modal";
import Row from "../layout/Row";
import Col from "../layout/Col";
import Select from "react-select";
import Button from "../common/Button";
import FileUploader from "../specific/FileUploader";
import DatePicker from "../specific/DatePicker";
import { VALIDATE_RULE } from "../../constants";
import {
  initialStaffFormForCreate,
  initialStaffFormForEdit,
} from "../../assets/forms/staffForm";
import { optionList } from "../../assets/options/staffOptionSelects";
import { initialErrorFormForStaff } from "../../assets/errors/errorForStaffModal";
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
  setSelectedStaffForEdit,
  selectSelectedStaffForEdit,
  setLoading,
  updateExistingStaff,
  selectError as errorStaff,
  deleteExistingStaff,
  selectProgressing as progressingStaff,
  retrieveStaffList,
  selectDeletedStaffData,
  selectWillUpdatingStaffData,
  setWillBeUpdatedStaffData,
  selectWillBeUpdatedStaffData,
  setWillUpdatingStaffData,
  createNewStaff,
  selectStaffTableData,
} from "../../features/staffSlice";
import { SpinnerCircular } from "spinners-react";
import convertFullNameToUsername from "../../utils/convertToUsername";
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

/* eslint-disable */
function LeftSideFormModal({ isModalDisplay, type, setModalHide, formData }) {
  const [componentAvailable, setComponentAvailable] = useState(true);
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  // watch retrieve status of select list for options of <Select>
  const retrieveSelectStatus = useSelector(selectIsSuccess);
  const retrieveSelectResult = useSelector(selectOptionList);
  const retrieveSelectError = useSelector(selectError);
  // watch error of redux async thunk progression
  const staffError = useSelector(errorStaff);
  // watch status of redux async thunk progression
  const staffProgression = useSelector(progressingStaff);

  const logData = useSelector(selectLogsData);

  const selectedStaffForEdit = useSelector(selectSelectedStaffForEdit);

  // the fields with old value of selected record will be updated
  const willBeUpdatedStaff = useSelector(selectWillBeUpdatedStaffData);
  // the fields with new value of selected record will updating to
  const willUpdatingStaff = useSelector(selectWillUpdatingStaffData);

  const deletedStaff = useSelector(selectDeletedStaffData);

  const autoGenerate = useAutoGenerate();
  const initialPasswordString = autoGenerate(12);
  const [showPassword, setShowPassword] = useState(false);
  // get the AccountTableList to define Username (not duplicating)
  const staffDataTableList = useSelector(selectStaffTableData);
  const [usernameValidation, setUsernameValidation] = useState(false);

  // using string generator hook
  const generateNewPassword = (length) => {
    const newPassword = autoGenerate(length);
    setNewStaffForm((state) => {
      const newState = { ...state };
      newState.Staff.Password.label = newPassword;
      newState.Staff.Password.value = newPassword;
      return newState;
    });
  };

  // all the input form below must have this 2 properties
  // (name, data-table)

  // define the select list use for dropdown form control,
  // empty select lists have to retrieve data from Airtable
  // optionList is defined in features/LeftSideFormModal.js
  const [selectList, setSelectList] = useState(optionList);

  // define the data object that used for display and upload to
  // airtable the key name is the looked up value (read-only)
  // the 'linkedField' property is the actual field that
  // the new record will be add by this linkedField,
  // the field key and the linkedField is looked up field if
  // they are the same
  // initialStaffFormForCreate is defined in assets/forms/staffForm
  // added Password generation
  const [newStaffForm, setNewStaffForm] = useState({
    Staff: {
      ...initialStaffFormForCreate.Staff,
      Password: {
        ...initialStaffFormForCreate.Staff.Password,
        value: initialPasswordString,
        label: initialPasswordString,
      },
    },
  });
  // define this for comparing value when editting
  // if the value has been changed after a handleStaffInput,
  // enable the Submit Changes button, this is the initial form
  // every changing/modifying is happened in newStaffForm
  const [newStaffFormForEdit, setNewStaffFormForEdit] = useState(
    initialStaffFormForEdit
  );
  const [isSfaffFormChanged, setStaffFormChangeStatus] = useState(false);

  // define the error status and message
  // initialErrorFormForStaff is defined in constants.js
  const [errorForm, setErrorForm] = useState(initialErrorFormForStaff);

  // define the ref list (for error form to focus)
  const refList = {
    FullName: useRef(null),
    Gender: useRef(null),
    DateOfBirth: useRef(null),
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
  const handleStaffInput = (e, action) => {
    setStaffFormChangeStatus(false);
    if (e === null) {
      // when clearing a single select input
      setNewStaffForm((state) => {
        const { "data-table": dataTable, name } = action.removedValues[0];
        const newState = { ...state };
        newState[dataTable][name].value = "";
        newState[dataTable][name].label = "";
        return newState;
      });
    } else if (typeof e === "object") {
      if (e.target) {
        setNewStaffForm((state) => {
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
          } else if (e.inputType && e.inputType === "datePicker") {
            // used for DatePicker input
            dataTable = e.target["data-table"];
            name = e.target.name;
            value = e.target.value;
            label = e.target.label;
          }
          const newState = { ...state };
          newState[dataTable][name].value = value;
          newState[dataTable][name].label = label;
          // handle Username generator
          if (name === "FullName") {
            setUsernameValidation(true);
            let newUsername = convertFullNameToUsername(value);
            const currentDomain = newState.Staff.Domain.label;
            const filteredRecordSameUsername = staffDataTableList?.filter(
              (record) => record.fields.Username.startsWith(newUsername)
            );
            if (filteredRecordSameUsername.length === 0) {
              newState.Staff.Username.value = newUsername;
              newState.Staff.Username.label = newUsername;
              newState.Staff.Account.value = newUsername + currentDomain;
              newState.Staff.Account.label = newUsername + currentDomain;
            } else {
              const filteredRecordSameUsernameExactly =
                filteredRecordSameUsername?.filter(
                  (record) => record.fields.Username === newUsername
                );
              if (filteredRecordSameUsernameExactly.length === 0) {
                newState.Staff.Username.value = newUsername;
                newState.Staff.Username.label = newUsername;
                newState.Staff.Account.value = newUsername + currentDomain;
                newState.Staff.Account.label = newUsername + currentDomain;
              } else {
                let startCount = 1;
                while (true) {
                  let newCountUsername = newUsername + startCount;
                  if (
                    filteredRecordSameUsername.indexOf(newCountUsername) === -1
                  ) {
                    newState.Staff.Username.value = newCountUsername;
                    newState.Staff.Username.label = newCountUsername;
                    newState.Staff.Account.value =
                      newCountUsername + currentDomain;
                    newState.Staff.Account.label =
                      newCountUsername + currentDomain;
                    break;
                  }
                  startCount++;
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
          setNewStaffForm((state) => {
            const newState = { ...state };
            const { name, "data-table": dataTable, filesUploaded } = e;
            newState[dataTable][name].value = [filesUploaded[0]];
            newState[dataTable][name].label = filesUploaded[0].url;
            return newState;
          });
        } else {
          if (e.filesFailed.length) {
            // image upload failed
            console.log("image upload failed", e);
          } else {
            // clear image from newStaffForm
            setNewStaffForm((state) => {
              const newState = { ...state };
              const { name, "data-table": dataTable } = e;
              newState[dataTable][name].value = [];
              newState[dataTable][name].label = "";
              return newState;
            });
          }
        }
      } else {
        setNewStaffForm((state) => {
          // used for select input
          const newState = { ...state };
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
          } else {
            const newState = { ...state };
            const { "data-table": dataTable, name, value, label } = e;
            // when chosing Company it will change the Username and Domain too
            if (name === "Company") {
              const username = newState[dataTable].Username;
              const domain = newState[dataTable].Domain;
              const userAccount = newState[dataTable].Account;
              domain.value = [value];
              domain.label = selectList[dataTable].Domain.list.find(
                (item) => item.value === value
              ).label;
              userAccount.value = username.value + domain.value;
              userAccount.label = username.label + domain.label;
            }
            if (newStaffForm[dataTable][name]["data-type"] === "singleSelect") {
              // pure single select
              newState[dataTable][name].value = value;
            } else {
              console.log("Unknown field!", `${dataTable}.${name}`);
            }
            newState[dataTable][name].label = label;
          }
          return newState;
        });
      }
    }
    handleValidate();
    handleCompareChanges(newStaffForm, newStaffFormForEdit);
  };

  // validate the newStaffForm
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
      const staffForm = newStaffForm.Staff;
      // FullName
      if (staffForm.FullName.value === "") {
        newErr.errMsg.Staff.FullName = "The Full Name is mustn't empty";
        newErr.errStatus = true;
      } else {
        const fullNameRule = VALIDATE_RULE.fullName;
        const fullNameVal = staffForm.FullName.value;
        if (fullNameVal.length < fullNameRule.minLength) {
          newErr.errMsg.Staff.FullName =
            "The Full Name length's must higher than 3";
          newErr.errStatus = true;
        } else if (fullNameVal.length > fullNameRule.maxLength) {
          newErr.errMsg.Staff.FullName =
            "The Full Name length's must less than 31";
          newErr.errStatus = true;
        } else if (fullNameVal.match(fullNameRule.pattern) === null) {
          newErr.errMsg.Staff.FullName = "The Full Name is invalid";
          newErr.errStatus = true;
        }
      }
      // Gender
      if (staffForm.Gender.value === "") {
        newErr.errMsg.Staff.Gender = "The Gender is mustn't empty";
        newErr.errStatus = true;
      }
      // Date Of Birth
      if (staffForm.DateOfBirth.value === "") {
        newErr.errMsg.Staff.DateOfBirth = "The DateOfBirth is mustn't empty";
        newErr.errStatus = true;
      }
      // Phone
      if (staffForm.Phone.value === "") {
        newErr.errMsg.Staff.Phone = "The Phone is mustn't empty";
        newErr.errStatus = true;
      } else {
        const phoneRule = VALIDATE_RULE.phone;
        const phoneVal = staffForm.Phone.value;
        if (phoneVal.match(phoneRule.pattern) === null) {
          newErr.errMsg.Staff.Phone = "The Phone nummber is invalid";
          newErr.errStatus = true;
        }
      }
      // Company
      if (staffForm.Company.value === "") {
        newErr.errMsg.Staff.Company = "The Company is mustn't empty";
        newErr.errStatus = true;
      }
      // Working Type
      if (staffForm.WorkingType.value === "") {
        newErr.errMsg.Staff.WorkingType = "The Working Type is mustn't empty";
        newErr.errStatus = true;
      }
      // Working Status
      if (staffForm.WorkingStatus.value === "") {
        newErr.errMsg.Staff.WorkingStatus =
          "The Working Status is mustn't empty";
        newErr.errStatus = true;
      }
      // Start Working Day
      if (staffForm.StartWorkingDay.value === "") {
        newErr.errMsg.Staff.StartWorkingDay =
          "The Start Working Day is mustn't empty";
        newErr.errStatus = true;
      }
      return newErr;
    });
  };

  // compare changes of modal form
  const handleCompareChanges = (oldForm, newForm) => {
    const compareResult = compareTwoObject(oldForm, newForm);
    // console.log(newForm, newFormForEdit);
    // console.log(compareResult);
    setStaffFormChangeStatus(!compareResult);
  };

  // handle retrieve table after a create/update/delete
  const handleRetrieveStaffTable = () => {
    dispatch(retrieveStaffList());
  };

  // handle submit the new staff creation or update staff info
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errorForm.errStatus) {
      setErrorForm({ ...errorForm, isShowMsg: true });
      let findFirstErrRef = false;
      for (const tableErrObj of errorForm.errMsg) {
        if (findFirstErrRef) return;
        for (const fieldKey in tableErrObj) {
          if (tableErrObj[fieldKey] !== "") {
            refList[fieldKey]?.current.scrollIntoView();
            findFirstErrRef = true;
            return;
          }
        }
      }
      return;
    }
    // create new record object suitable with fields in airtable
    // this is the data to upload to airtable
    let newRecord = { Staff: null };
    // this is the old data that has been overwrited
    let oldRecord = { Staff: null };
    Object.keys(newRecord).forEach((tableKey) => {
      Object.entries(
        type === "create"
          ? newStaffForm[tableKey] // type === "create"
          : newStaffFormForEdit[tableKey] // type === "edit"
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
                    newStaffFormForEdit[tableKey][field[0]].value[j]
                  )
                ) {
                  return;
                }
              }
            } else if (typeof field[1].value[0] === "string") {
              if (
                compareTwoArrayOfString(
                  field[1].value,
                  newStaffFormForEdit[tableKey][field[0]].value
                )
              ) {
                return;
              }
            }
          } else if (typeof field[1].value === "string") {
            if (
              field[1].value.length === 0 ||
              field[1].value === newStaffFormForEdit[tableKey][field[0]].value
            ) {
              return;
            }
          }
          oldRecord[tableKey][field[1].linkedField] =
            newStaffFormForEdit[tableKey][field[1].linkedField].value;
        }
        newRecord[tableKey][field[1].linkedField] = field[1].value;
      });
    });

    // save the old data to redux (available with Update action)
    dispatch(setWillBeUpdatedStaffData(oldRecord.Staff));

    // processing submit new staff object to database
    if (type === "create") {
      dispatch(setLoading(true));
      dispatch(createNewStaff(newRecord.Staff));
    } else {
      try {
        dispatch(
          updateExistingStaff({
            recordId: selectedStaffForEdit.id,
            updateData: newRecord.Staff,
          })
        );
      } catch (e) {
        console.log("Source code error", e);
      }
    }
  };

  // handle delete a staff
  const handleDeleteStaff = (e) => {
    e.preventDefault();
    const staffRecordId = selectedStaffForEdit.id;
    dispatch(deleteExistingStaff(staffRecordId));
  };

  // handle finish task (create/update/delete)
  const handleFinishTask = () => {
    setModalHide();
    dispatch(setSelectedStaffForEdit(null));
    dispatch(setLogsData(null));
  };

  // effect catch the create/update/delete api
  // there are 3 prefix progression of the table
  // (<staff>/<retrieve|create|update|delete>)
  // and a status behind (pending/rejected/fulfilled)
  // (ex. staff/create/pending, staff/update/rejected ,...)
  // added toast display
  // added logs creation
  useEffect(() => {
    // staff progression
    switch (staffProgression) {
      case "staff/create/rejected":
        console.log(staffError);
        dispatch(
          createNewLog({
            Actions: "Create",
            Account: getLocalUser().Account,
            TableAffected: "Staff",
            Status: "Failed",
            Notes: `Create a new Staff errored,\n${JSON.stringify(e)}`,
          })
        );
        addToast("Fail to create a new staff record!", {
          appearance: "error",
        });
        break;
      case "staff/create/fulfilled":
        dispatch(
          createNewLog({
            Actions: "Create",
            Account: getLocalUser().Account,
            RecordAffected: staffRes.id,
            TableAffected: "Staff",
            Status: "Done",
            NewValue: JSON.stringify(staffRes.fields),
            Notes: "Create a new Staff",
          })
        );
        addToast("Create a new staff record successfully!", {
          appearance: "success",
        });
        handleRetrieveStaffTable();
        break;
      case "staff/update/rejected":
        console.error(staffError);
        dispatch(
          createNewLog({
            Actions: "Update",
            Account: getLocalUser().Account,
            RecordAffected: willUpdatingStaff.recordId,
            TableAffected: "Staff",
            Status: "Failed",
            OldValue: JSON.stringify(willBeUpdatedStaff),
            NewValue: JSON.stringify(willUpdatingStaff.updateData),
            Notes: `Update an existing Staff errored,\n${JSON.stringify(
              staffError
            )}`,
          })
        );
        addToast("Fail to update the staff record!", {
          appearance: "error",
        });
        break;
      case "staff/update/fulfilled":
        dispatch(
          createNewLog({
            Actions: "Update",
            Account: getLocalUser().Account,
            RecordAffected: willUpdatingStaff.recordId,
            TableAffected: "Staff",
            Status: "Done",
            OldValue: JSON.stringify(willBeUpdatedStaff),
            NewValue: JSON.stringify(willUpdatingStaff.updateData),
            Notes: `Update an existing Staff`,
          })
        );
        addToast("Update the staff record successfully!", {
          appearance: "success",
        });
        handleRetrieveStaffTable();
        break;
      case "staff/delete/rejected":
        console.log(staffError);
        dispatch(
          createNewLog({
            Actions: "Delete",
            Account: getLocalUser().Account,
            RecordAffected: selectedStaffForEdit.id,
            TableAffected: "Staff",
            Status: "Failed",
            Notes: `Delete an existing Staff errored,\n${JSON.stringify(
              staffError
            )}`,
          })
        );
        addToast("Fail to delete the staff record!", {
          appearance: "error",
        });
        break;
      case "staff/delete/fulfilled":
        dispatch(
          createNewLog({
            Actions: "Delete",
            Account: getLocalUser().Account,
            RecordAffected: deletedStaff.id,
            TableAffected: "Staff",
            Status: "Done",
            OldValue: JSON.stringify(deletedStaff.fields),
            Notes: `Delete an existing Staff `,
          })
        );
        addToast("Delete the staff record successfully!", {
          appearance: "success",
        });
        handleRetrieveStaffTable();
        break;
    }
  }, [staffProgression]);

  // logs listener, finish task when the log has been created
  useEffect(() => {
    if (logData) {
      handleFinishTask();
      dispatch(setWillBeUpdatedStaffData(null));
      dispatch(setWillUpdatingStaffData(null));
    }
    // eslint-disable-next-line
  }, [logData]);

  // update the modal initial state (newStaffForm)
  // when select a staff to edit or clear staff when click Add new staff
  useEffect(() => {
    // when select a staff to edit
    const setNewStaff = (state) => {
      let newState = { ...state };
      // set for Staff
      Object.entries(newState.Staff).forEach((formField) => {
        const valueOfFieldsSelected = selectedStaffForEdit.fields[formField[0]];
        const fieldType = formField[1]["data-type"];
        if (
          fieldType === "linkToAnotherTable" ||
          fieldType === "lookup" ||
          fieldType === "multipleSelect"
        ) {
          // linked field and looked up field
          newState.Staff[formField[0]].value =
            selectedStaffForEdit.fields[formField[1].linkedField];
          newState.Staff[formField[0]].label = valueOfFieldsSelected;
        } else {
          if (fieldType === "attachment") {
            // array of attachment
            newState.Staff[formField[0]].value = valueOfFieldsSelected;
            newState.Staff[formField[0]].label =
              valueOfFieldsSelected[0].thumbnails.large.url;
          } else {
            // string text value or single select
            newState.Staff[formField[0]].value = valueOfFieldsSelected;
            newState.Staff[formField[0]].label = valueOfFieldsSelected;
          }
        }
      });
      return newState;
    };
    // when click Add new staff button
    const resetNewStaff = (state) => {
      let newState = { ...state };
      Object.keys(newState).forEach((tableKey) => {
        Object.entries(newState[tableKey]).forEach((formField) => {
          // specific field Password, regenerate per time set new staff
          if (formField[0] === "Password") {
            const newPasswordGenerated = autoGenerate(12);
            newState[tableKey][formField[0]].value = newPasswordGenerated;
            newState[tableKey][formField[0]].label = newPasswordGenerated;
          } else {
            if (
              formField[1]["data-type"] === "attachment" ||
              formField[1]["data-type"] === "multipleSelect" ||
              (formField[1]["data-type"] === "linkToAnotherTable" &&
                formField[1].isMultiple)
            ) {
              newState[tableKey][formField[0]].value = [];
            } else {
              newState[tableKey][formField[0]].value = "";
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
    if (selectedStaffForEdit) {
      console.log("Test");
      setNewStaffForm(setNewStaff);
      setNewStaffFormForEdit(setNewStaff);
      // reset errorForm state, see the initialErrorFormForStaff
      setErrorForm(resetError);
    } else {
      // reset newStaffForm state, see the initialStaffFormForCreate in constant.js
      setNewStaffForm(resetNewStaff);
      setNewStaffFormForEdit(resetNewStaff);
      // reset errorForm state, see the initialErrorFormForStaff
      setErrorForm(resetError);
    }
    setStaffFormChangeStatus(false);
  }, [selectedStaffForEdit]);

  // for the Select component, define the className as "<tableName> <fieldName>"
  return (
    <Modal onModalHide={setModalHide} isModalDisplay={isModalDisplay}>
      <Row className="py-4 justify-content-center">
        <Col columnSize={["auto"]}>
          <h1 className="font-weight-bold">
            {type === "create" ? "Add new staff" : "Edit the staff"}
          </h1>
        </Col>
      </Row>
      <hr className="navbar-divider"></hr>
      <form className="form">
        <h3 className="font-weight-bold text-center">General Information</h3>
        <div className="form-group">
          <label htmlFor="FullName" ref={refList.FullName}>
            Full name <span className="text-danger">*</span>
          </label>
          <input
            name="FullName"
            data-table="Staff"
            data-type={newStaffForm.Staff.FullName["data-type"]}
            className="form-control"
            type="text"
            value={newStaffForm.Staff.FullName.label}
            onChange={handleStaffInput}
            onBlur={handleValidate}
            placeholder="Enter full name..."
          />
          {errorForm.errMsg.Staff.FullName !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.Staff.FullName}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="Gender" ref={refList.Gender}>
            Gender <span className="text-danger">*</span>
          </label>
          <Select
            className="Staff Gender"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Staff.Gender.value && {
                "data-table": "Staff",
                "data-type": newStaffForm.Staff.Gender["data-type"],
                label: newStaffForm.Staff.Gender.label,
                value: newStaffForm.Staff.Gender.value,
                name: "Gender",
              }
            }
            options={selectList.Staff.Gender.list}
            placeholder="Select gender..."
            isClearable
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
          {errorForm.errMsg.Staff.Gender !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.Staff.Gender}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="Portrait">Portrait</label>
          <FileUploader
            name="Portrait"
            data-table="Staff"
            data-type={newStaffForm.Staff.Portrait["data-type"]}
            imgData={newStaffForm.Staff.Portrait.value}
            mediaType="image"
            type={type}
            handleUploadSuccessfully={handleStaffInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="DateOfBirth" ref={refList.DateOfBirth}>
            Day of birth <span className="text-danger">*</span>
          </label>
          <DatePicker
            className="form-control"
            name="DateOfBirth"
            data-table="Staff"
            data-type={newStaffForm.Staff.DateOfBirth["data-type"]}
            value={
              newStaffForm.Staff.DateOfBirth.value &&
              newStaffForm.Staff.DateOfBirth.label
            }
            onChange={handleStaffInput}
            onBlur={handleValidate}
          />
          {errorForm.errMsg.Staff.DateOfBirth !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.Staff.DateOfBirth}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="Phone" ref={refList.Phone}>
            Phone number <span className="text-danger">*</span>
          </label>
          <input
            name="Phone"
            data-table="Staff"
            data-type={newStaffForm.Staff.Phone["data-type"]}
            className="form-control"
            type="tel"
            value={
              newStaffForm.Staff.Phone.value && newStaffForm.Staff.Phone.label
            }
            onChange={handleStaffInput}
            onBlur={handleValidate}
            placeholder="0123 456 789"
          />
          {errorForm.errMsg.Staff.Phone !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.Staff.Phone}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="PersonalEmail">Personal email</label>
          <input
            name="PersonalEmail"
            data-table="Staff"
            data-type={newStaffForm.Staff.PersonalEmail["data-type"]}
            className="form-control"
            value={
              newStaffForm.Staff.PersonalEmail.value &&
              newStaffForm.Staff.PersonalEmail.label
            }
            type="email"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            placeholder="example@foo.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="Company" ref={refList.Company}>
            Company <span className="text-danger">*</span>
          </label>
          <Select
            className="Staff Company"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Staff.Company.value && {
                "data-table": "Staff",
                "data-type": newStaffForm.Staff.Company["data-type"],
                label: newStaffForm.Staff.Company.label,
                value: newStaffForm.Staff.Company.value,
                name: "Company",
              }
            }
            options={selectList.Staff.Company.list}
            isMulti={newStaffForm.Staff.Company.isMultiple}
            placeholder="Who to work for..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
          {errorForm.errMsg.Staff.Company !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.Staff.Company}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="CurrentWorkingPlace">Working Place</label>
          <Select
            className="Staff CurrentWorkingPlace"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Staff.CurrentWorkingPlace.value && {
                "data-table": "Staff",
                "data-type":
                  newStaffForm.Staff.CurrentWorkingPlace["data-type"],
                label: newStaffForm.Staff.CurrentWorkingPlace.label,
                value: newStaffForm.Staff.CurrentWorkingPlace.value,
                name: "CurrentWorkingPlace",
              }
            }
            options={selectList.Staff.CurrentWorkingPlace.list}
            isMulti={newStaffForm.Staff.CurrentWorkingPlace.isMultiple}
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
          <label htmlFor="RoleType">Role Type</label>
          <Select
            className="Staff RoleType"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Staff.RoleType.value && {
                "data-table": "Staff",
                "data-type": newStaffForm.Staff.RoleType["data-type"],
                label: newStaffForm.Staff.RoleType.label,
                value: newStaffForm.Staff.RoleType.value,
                name: "RoleType",
              }
            }
            options={selectList.Staff.RoleType.list}
            isMulti={newStaffForm.Staff.RoleType.isMultiple}
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
          <label htmlFor="ContractType" ref={refList.ContractType}>
            Contract Type
          </label>
          <Select
            className="Staff ContractType"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Staff.ContractType.value && {
                "data-table": "Staff",
                "data-type": newStaffForm.Staff.ContractType["data-type"],
                label: newStaffForm.Staff.ContractType.label,
                value: newStaffForm.Staff.ContractType.value,
                name: "ContractType",
              }
            }
            options={selectList.Staff.ContractType.list}
            placeholder="Contract type..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
          {errorForm.errMsg.Staff.ContractType !== "" &&
            errorForm.isShowMsg && (
              <div className="err-text text-danger mt-1">
                {errorForm.errMsg.Staff.ContractType}
              </div>
            )}
        </div>
        <div className="form-group">
          <label htmlFor="WorkingType" ref={refList.WorkingType}>
            Working Type <span className="text-danger">*</span>
          </label>
          <Select
            className="Staff WorkingType"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Staff.WorkingType.value && {
                "data-table": "Staff",
                "data-type": newStaffForm.Staff.WorkingType["data-type"],
                label: newStaffForm.Staff.WorkingType.label,
                value: newStaffForm.Staff.WorkingType.value,
                name: "WorkingType",
              }
            }
            options={selectList.Staff.WorkingType.list}
            placeholder="Working type..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
          {errorForm.errMsg.Staff.WorkingType !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.Staff.WorkingType}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="WorkingPeriod" ref={refList.WorkingPeriod}>
            Working Period <span className="text-danger">*</span>
          </label>
          <Select
            className="Staff WorkingPeriod"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Staff.WorkingPeriod.value && {
                "data-table": "Staff",
                "data-type": newStaffForm.Staff.WorkingPeriod["data-type"],
                label: newStaffForm.Staff.WorkingPeriod.label,
                value: newStaffForm.Staff.WorkingPeriod.value,
                name: "WorkingPeriod",
              }
            }
            options={selectList.Staff.WorkingPeriod.list}
            placeholder="Working period..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
          {errorForm.errMsg.Staff.WorkingPeriod !== "" &&
            errorForm.isShowMsg && (
              <div className="err-text text-danger mt-1">
                {errorForm.errMsg.Staff.WorkingPeriod}
              </div>
            )}
        </div>
        <div className="form-group">
          <label htmlFor="WorkingStatus" ref={refList.WorkingStatus}>
            Working Status <span className="text-danger">*</span>
          </label>
          <Select
            className="Staff WorkingStatus"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Staff.WorkingStatus.value && {
                "data-table": "Staff",
                "data-type": newStaffForm.Staff.WorkingStatus["data-type"],
                label: newStaffForm.Staff.WorkingStatus.label,
                value: newStaffForm.Staff.WorkingStatus.value,
                name: "WorkingType",
              }
            }
            options={selectList.Staff.WorkingStatus.list}
            placeholder="Working status..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
          {errorForm.errMsg.Staff.WorkingStatus !== "" &&
            errorForm.isShowMsg && (
              <div className="err-text text-danger mt-1">
                {errorForm.errMsg.Staff.WorkingStatus}
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
            data-table="Staff"
            data-type={newStaffForm.Staff.StartWorkingDay["data-type"]}
            value={
              newStaffForm.Staff.StartWorkingDay.value &&
              newStaffForm.Staff.StartWorkingDay.label
            }
            onChange={handleStaffInput}
            onBlur={handleValidate}
          />
          {errorForm.errMsg.Staff.StartWorkingDay !== "" &&
            errorForm.isShowMsg && (
              <div className="err-text text-danger mt-1">
                {errorForm.errMsg.Staff.StartWorkingDay}
              </div>
            )}
        </div>
        <div className="form-group">
          <label htmlFor="MarriageStatus">Marriage Status</label>
          <Select
            className="Status MarriageStatus"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Staff.MarriageStatus.value && {
                "data-table": "Staff",
                "data-type": newStaffForm.Staff.MarriageStatus["data-type"],
                label: newStaffForm.Staff.MarriageStatus.label,
                value: newStaffForm.Staff.MarriageStatus.value,
                name: "MarriageStatus",
              }
            }
            options={selectList.Staff.MarriageStatus.list}
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
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Staff.HealthStatus.value && {
                "data-table": "Staff",
                "data-type": newStaffForm.Staff.HealthStatus["data-type"],
                label: newStaffForm.Staff.HealthStatus.label,
                value: newStaffForm.Staff.HealthStatus.value,
                name: "HealthStatus",
              }
            }
            options={selectList.Staff.HealthStatus.list}
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
          <label htmlFor="CurriculumVitae">Curriculum Vitae</label>
          <FileUploader
            name="CurriculumVitae"
            data-table="Staff"
            imgData={newStaffForm.Staff.CurriculumVitae.value}
            mediaType="PDF"
            type={type}
            handleUploadSuccessfully={handleStaffInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Notes">Notes</label>
          <textarea
            name="Notes"
            data-table="Staff"
            data-type={newStaffForm.Staff.Notes["data-type"]}
            className="form-control"
            value={
              newStaffForm.Staff.Notes.value && newStaffForm.Staff.Notes.label
            }
            onChange={handleStaffInput}
            onBlur={handleValidate}
            placeholder="Notes..."
            style={{
              resize: "none",
            }}
          />
        </div>
        <hr className="navbar-divider"></hr>
        <h3 className="font-weight-bold text-center">Account Information</h3>
        <div className="form-group">
          <label htmlFor="Username">Username</label>
          <span
            name="Username"
            data-table="Staff"
            data-type={newStaffForm.Staff.Username["data-type"]}
            className="form-control"
          >
            {newStaffForm.Staff.Username.label}
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="Domain">Domain</label>
          <span
            name="Domain"
            data-table="Staff"
            data-type={newStaffForm.Staff.Domain["data-type"]}
            className="form-control"
          >
            {newStaffForm.Staff.Domain.label}
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="Account">User Account</label>
          <span
            name="Account"
            data-table="Staff"
            data-type={newStaffForm.Staff.Account["data-type"]}
            className="form-control"
          >
            {newStaffForm.Staff.Account.label}
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="Password">Password</label>
          <div className="input-group input-group-merge">
            <input
              name="Password"
              autoComplete="none"
              data-table="Staff"
              data-type={newStaffForm.Staff.Password["data-type"]}
              className="form-control form-control-appended"
              type={showPassword ? "text" : "password"}
              value={newStaffForm.Staff.Password.label}
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
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Staff.AccountStatus.value && {
                "data-table": "Staff",
                "data-type": newStaffForm.Staff.AccountStatus["data-type"],
                label: newStaffForm.Staff.AccountStatus.label,
                value: newStaffForm.Staff.AccountStatus.value,
                name: "AccountStatus",
              }
            }
            options={selectList.Staff.AccountStatus.list}
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
          <FileUploader
            name="Avatar"
            data-table="Staff"
            data-type={newStaffForm.Staff.Avatar["data-type"]}
            imgData={newStaffForm.Staff.Avatar.value}
            mediaType="image"
            type={type}
            handleUploadSuccessfully={handleStaffInput}
            handleClearImg={handleStaffInput}
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
              {type === "create" ? "Add new staff" : "Submit changes"}
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
                onClick={handleDeleteStaff}
              >
                {usernameValidation && <SpinnerCircular />}
                Delete this staff
              </Button>
            </Col>
          </Row>
        )}
      </form>
    </Modal>
  );
}

LeftSideFormModal.propTypes = {
  isModalDisplay: PropTypes.bool,
  type: PropTypes.oneOf(["create", "edit"]).isRequired,
  setModalHide: PropTypes.func,
  setModalType: PropTypes.func,
};

export default LeftSideFormModal;
