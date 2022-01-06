import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Modal from "../common/Modal";
import Row from "../layout/Row";
import Col from "../layout/Col";
import Select from "react-select";
import Button from "../common/Button";
import ImageUploader from "../common/ImageUploader";
import {
  initialErrorFormForStaff,
  initialStaffFormForCreate,
  initialStaffFormForEdit,
  optionList,
  VALIDATE_RULE,
} from "../../constants";
import useAutoGenerate from "../hooks/useAutoGenerate";
import { MdRefresh, MdRemoveRedEye } from "react-icons/md";
import DatePicker from "../common/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  fetchAllEmptySelectList,
  selectError,
  selectIsSuccess,
  selectOptionList,
} from "../../features/selectListSlice";
import {
  selectSelectedStaffForEdit,
  setLoading,
  setNewStaffData,
  updateExistingStaff,
  selectError as errorStaff,
} from "../../features/staffSlice";
import {
  selectSelectedStatusForEdit,
  updateExistingStatus,
  createNewStatus,
  selectError as errorStatus,
} from "../../features/statusSlice";
import {
  selectSelectedAccountForEdit,
  updateExistingAccount,
  createNewAccount,
  selectAccountTableData,
  selectError as errorAccount,
} from "../../features/accountSlice";
import { SpinnerCircular } from "spinners-react";
import convertFullNameToUsername from "../../utils/convertToUsername";
import { createNewRecord } from "../../services/airtable.service";
import { compareTwoArrayOfString } from "../../utils/arrayUtils";

// NOTE: The Select component (from react-select) that doesn't
// support custom inner props when using component event listener
// (the event object doesn't contains the custom props), so we use
// className props to define the table(data-table) and the field
// name(name) to that Select component (syntax: "<data-table> <name>"),
// the normal input form-control still can use the custom props data-table
// and name.

function StaffModal({ isModalDisplay, type, setModalHide, setModalType }) {
  let [componentAvailable, setComponentAvailable] = useState(true);
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const retriveSelectStatus = useSelector(selectIsSuccess);
  const retriveSelectResult = useSelector(selectOptionList);
  const retriveSelectError = useSelector(selectError);
  const staffError = useSelector(errorStaff);
  const statusError = useSelector(errorStatus);
  const accountError = useSelector(errorAccount);

  const selectedStaffForEdit = useSelector(selectSelectedStaffForEdit);
  const selectedStatusForEdit = useSelector(selectSelectedStatusForEdit);
  const selectedAccountForEdit = useSelector(selectSelectedAccountForEdit);

  const autoGenerate = useAutoGenerate();
  const initialPasswordString = autoGenerate(12);
  const [showPassword, setShowPassword] = useState(false);
  // get the AccountTableList to define Username (not duplicating)
  const accountDataTableList = useSelector(selectAccountTableData);
  const [usernameValidation, setUsernameValidation] = useState(false);

  // using string generator hook
  const generateNewPassword = (length) => {
    const newPassword = autoGenerate(length);
    setNewStaffForm((state) => {
      const newState = { ...state };
      newState.Account.Password.label = newPassword;
      newState.Account.Password.value = newPassword;
      return newState;
    });
  };

  // all the input form below must have this 2 properties
  // (name, data-table)

  // define the select list use for dropdown form control
  // empty select lists have to retrive data from Airtable
  // optionList is defined in constants.js
  const [selectList, setSelectList] = useState(optionList);

  // define the data object that used for display and upload to
  // airtable the key name is the looked up value (read-only)
  // the 'linkedField' property is the actual field that
  // the new record will be add by this linkedField,
  // the field key and the linkedField is looked up field if
  // they are the same
  // initialStaffFormForCreate is defined in constants.js
  // added Password generation
  const [newStaffForm, setNewStaffForm] = useState({
    ...initialStaffFormForCreate,
    Account: {
      ...initialStaffFormForCreate.Account,
      Password: {
        ...initialStaffFormForCreate.Account.Password,
        value: initialPasswordString,
        label: initialPasswordString,
      },
    },
  });
  // define this for comparing value when editting
  // if the value has been changed after a handleStaffInput,
  // enable the Submit Changes button
  const [newStaffFormForEdit, setNewStaffFormForEdit] = useState(
    initialStaffFormForEdit
  );
  const [isSfaffFormChanged, setSubmitChangeStatus] = useState(false);

  // define the error status and message
  // initialErrorFormForStaff is defined in constants.js
  const [errorForm, setErrorForm] = useState(initialErrorFormForStaff);

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

  /* eslint-disable */
  // retrive data from airtable into empty select list
  useEffect(() => {
    if (retriveSelectResult) {
      componentAvailable && setSelectList(retriveSelectResult);
    } else {
      if (retriveSelectStatus) {
        if (retriveSelectError) {
          console.log(retriveSelectError);
        }
      } else {
        dispatch(fetchAllEmptySelectList(selectList));
      }
    }
    return () => {
      setComponentAvailable(false);
    };
  }, [
    componentAvailable,
    dispatch,
    retriveSelectStatus,
    retriveSelectResult,
    retriveSelectError,
  ]);
  // Handle the input change (valitdate right after the input change)
  // Normal input/select handle
  const handleStaffInput = (e, action) => {
    console.log(newStaffFormForEdit.Staff.FullName.value);
    setSubmitChangeStatus(false);
    if (e === null) {
      // when clearing a single select input
      setNewStaffForm((state) => {
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
          if (newStaffFormForEdit[dataTable][name].value !== value) {
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
          setNewStaffForm((state) => {
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
              newStaffFormForEdit[dataTable][name].label !==
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
            // clear image from newStaffForm
            setNewStaffForm((state) => {
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
        setNewStaffForm((state) => {
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
              compareTwoArrayOfString(
                newStaffFormForEdit[dataTable][name].value,
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
            if (newStaffForm[dataTable][name].linkedField === name) {
              // pure single select
              newState[dataTable][name].value = value;
              if (newStaffFormForEdit[dataTable][name].value === value) {
                setSubmitChangeStatus(true);
              }
            } else {
              // looked up/linked field
              newState[dataTable][name].value = [value];
              if (newStaffFormForEdit[dataTable][name].value[0] === value[0]) {
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

  // Validate and Submit
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
      const statusForm = newStaffForm.Status;
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
      if (staffForm.DOB.value === "") {
        newErr.errMsg.Staff.DOB = "The DOB is mustn't empty";
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
  // handle submit the new staff or change staff info
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
    let newRecord = { Staff: {}, Status: {}, Account: {} };
    Object.keys(newRecord).forEach((tableKey) => {
      Object.entries(newStaffForm[tableKey]).forEach((field) => {
        // exclude the field that can't be updated (duplicated/computed/empty)
        if (
          field[1].isRemovedWhenSubmit ||
          !field[1].value ||
          field[1].value?.length === 0
        ) {
          return;
        }
        newRecord[tableKey][field[1].linkedField] = field[1].value;
      });
    });

    // processing create new staff
    // we can't use the redux-thunk here because the async thunk
    // doesn't have access to the result of the async (we can only get it
    // from slice, then we can't catch the result when it's done in a same
    // function)
    if (type === "create") {
      dispatch(setLoading(true));
      createNewRecord("Staff", newRecord.Staff)
        .then((staffRes) => {
          try {
            dispatch(setNewStaffData(staffRes));
            dispatch(setLoading(false));
            addToast("Create a new staff record successfully!", {
              appearance: "success",
            });
            const newStaffRecordId = [staffRes.id];
            newRecord.Status.Staff = newStaffRecordId;
            newRecord.Account.Staff = newStaffRecordId;
            dispatch(createNewStatus(newRecord.Status));
            if (statusError) {
              console.log(statusError);
              addToast("Fail to create a new status record!", {
                appearance: "error",
              });
            } else {
              addToast("Create a new status record successfully!", {
                appearance: "success",
              });
            }
            dispatch(createNewAccount(newRecord.Account));
            if (accountError) {
              console.log(accountError);
              addToast("Fail to create a new account record!", {
                appearance: "error",
              });
            } else {
              addToast("Create a new staff record successfully!", {
                appearance: "success",
              });
            }
          } catch (e) {
            console.log("Async thunk error", e);
          }
        })
        .catch((e) => {
          console.log("Error while creating new staff", e);
          addToast("Fail to create a new staff record!", {
            appearance: "error",
          });
        })
        .finally(() => {
          setModalHide();
        });
    } else {
      try {
        dispatch(
          updateExistingStaff({
            recordId: selectedStaffForEdit.id,
            updateData: newRecord.Staff,
          })
        );
        if (staffError) {
          console.log(staffError);
          addToast("Fail to update a staff record!", { appearance: "error" });
        } else {
          addToast("Update a staff record successfully!", {
            appearance: "success",
          });
        }
        dispatch(
          updateExistingStatus({
            recordId: selectedStatusForEdit.id,
            updateData: newRecord.Status,
          })
        );
        if (statusError) {
          console.log(statusError);
          addToast("Fail to update a status record!", { appearance: "error" });
        } else {
          addToast("Update a status record successfully!", {
            appearance: "success",
          });
        }
        dispatch(
          updateExistingAccount({
            recordId: selectedAccountForEdit.id,
            updateData: newRecord.Account,
          })
        );
        if (accountError) {
          console.log(accountError);
          addToast("Fail to update an account record!", {
            appearance: "error",
          });
        } else {
          addToast("Update an account record successfully!", {
            appearance: "success",
          });
        }
      } catch (e) {
        console.log("Async thunk error", e);
      } finally {
        setModalHide();
        setModalType("create");
      }
    }
  };

  // update the modal initial state (newStaffForm)
  // when select a staff to edit or clear staff when click Add new staff
  useEffect(() => {
    const setNewStaff = (state) => {
      let newState = { ...state };
      // set for Staff
      Object.entries(newState.Staff).forEach((formField) => {
        const valueOfFieldsSelected = selectedStaffForEdit.fields[formField[0]];
        if (formField[0] === formField[1].linkedField) {
          if (Array.isArray(valueOfFieldsSelected)) {
            // array of attachment
            newState.Staff[formField[0]].value = valueOfFieldsSelected;
            newState.Staff[formField[0]].label = valueOfFieldsSelected[0].url;
          } else {
            // string text value or single select
            newState.Staff[formField[0]].value = valueOfFieldsSelected;
            newState.Staff[formField[0]].label = valueOfFieldsSelected;
          }
        } else {
          // linked field and looked up field
          newState.Staff[formField[0]].value =
            selectedStaffForEdit.fields[formField[1].linkedField];
          newState.Staff[formField[0]].label = valueOfFieldsSelected;
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
    const resetNewStaff = (state) => {
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
      selectedStaffForEdit &&
      selectedStatusForEdit &&
      selectedAccountForEdit
    ) {
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
  }, [selectedStaffForEdit, selectedStatusForEdit, selectedAccountForEdit]);

  return (
    <Modal setModalHide={setModalHide} isModalDisplay={isModalDisplay}>
      <Row className="py-4 justify-content-center">
        <Col columnSize={["auto"]}>
          <h1 className="font-weight-bold">
            {type === "create" ? "Add new staff" : "Edit the staff"}
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
            data-table="Staff"
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
          <ImageUploader
            name="Portrait"
            data-table="Staff"
            imgData={newStaffForm.Staff.Portrait.value}
            imgThumbnail={
              newStaffForm.Staff.Portrait.value &&
              newStaffForm.Staff.Portrait.label
            }
            handleUploadSuccessfully={handleStaffInput}
            handleClearImg={handleStaffInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="DOB" ref={refList.DOB}>
            Day of birth <span className="text-danger">*</span>
          </label>
          <DatePicker
            className="form-control"
            name="DOB"
            data-table="Staff"
            value={newStaffForm.Staff.DOB.value && newStaffForm.Staff.DOB.label}
            onChange={handleStaffInput}
            onBlur={handleValidate}
          />
          {errorForm.errMsg.Staff.DOB !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.Staff.DOB}
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
                label: newStaffForm.Staff.Company.label,
                value: newStaffForm.Staff.Company.value,
                name: "Company",
              }
            }
            options={selectList.Staff.Company.list}
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
                label: newStaffForm.Staff.CurrentWorkingPlace.label,
                value: newStaffForm.Staff.CurrentWorkingPlace.value,
                name: "CurrentWorkingPlace",
              }
            }
            options={selectList.Staff.CurrentWorkingPlace.list}
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
            className="Staff RoleType"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Staff.RoleType.value && {
                "data-table": "Staff",
                label: newStaffForm.Staff.RoleType.label,
                value: newStaffForm.Staff.RoleType.value,
                name: "RoleType",
              }
            }
            options={selectList.Staff.RoleType.list}
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
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Status.WorkingType.value && {
                "data-table": "Status",
                label: newStaffForm.Status.WorkingType.label,
                value: newStaffForm.Status.WorkingType.value,
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
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Status.WorkingStatus.value && {
                "data-table": "Status",
                label: newStaffForm.Status.WorkingStatus.label,
                value: newStaffForm.Status.WorkingStatus.value,
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
              newStaffForm.Status.StartWorkingDay.value &&
              newStaffForm.Status.StartWorkingDay.label
            }
            onChange={handleStaffInput}
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
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Status.MarriageStatus.value && {
                "data-table": "Status",
                label: newStaffForm.Status.MarriageStatus.label,
                value: newStaffForm.Status.MarriageStatus.value,
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
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Status.HealthStatus.value && {
                "data-table": "Status",
                label: newStaffForm.Status.HealthStatus.label,
                value: newStaffForm.Status.HealthStatus.value,
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
              newStaffForm.Status.Notes.value && newStaffForm.Status.Notes.label
            }
            onChange={handleStaffInput}
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
            onChange={handleStaffInput}
            onBlur={handleValidate}
            value={
              newStaffForm.Status.Covid19Vaccinated.value && {
                "data-table": "Status",
                label: newStaffForm.Status.Covid19Vaccinated.label,
                value: newStaffForm.Status.Covid19Vaccinated.value,
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
            onChange={handleStaffInput}
            onBlur={handleValidate}
            isMulti
            value={
              newStaffForm.Status.Covid19VaccineType.value &&
              newStaffForm.Status.Covid19VaccineType.value.map(
                (value, index) => {
                  return {
                    "data-table": "Status",
                    label: newStaffForm.Status.Covid19VaccineType.label[index],
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
            {newStaffForm.Account.Username.label}
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="Domain">Domain</label>
          <span name="Domain" data-table="Account" className="form-control">
            {newStaffForm.Account.Domain.label}
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="UserAccount">User Account</label>
          <span
            name="UserAccount"
            data-table="Account"
            className="form-control"
          >
            {newStaffForm.Account.UserAccount.label}
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
              value={newStaffForm.Account.Password.label}
              disabled
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
              newStaffForm.Account.AccountStatus.value && {
                "data-table": "Account",
                label: newStaffForm.Account.AccountStatus.label,
                value: newStaffForm.Account.AccountStatus.value,
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
            imgData={newStaffForm.Account.Avatar.value}
            imgThumbnail={
              newStaffForm.Account.Avatar.value &&
              newStaffForm.Account.Avatar.label
            }
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
      </form>
    </Modal>
  );
}

StaffModal.propTypes = {
  isModalDisplay: PropTypes.bool,
  type: PropTypes.oneOf(["create", "edit"]).isRequired,
  setModalHide: PropTypes.func,
  setModalType: PropTypes.func,
};

export default StaffModal;
