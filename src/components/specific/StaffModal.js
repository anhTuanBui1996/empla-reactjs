import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Modal from "../common/Modal";
import Row from "../layout/Row";
import Col from "../layout/Col";
import Select from "react-select";
import Button from "../common/Button";
import ImageUploader from "../common/ImageUploader";
import { initialStaffForm, VALIDATE_RULE } from "../../constants";
import useAutoGenerate from "../hooks/useAutoGenerate";
import { MdRefresh, MdRemoveRedEye } from "react-icons/md";
import DatePicker from "../common/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewStaff,
  selectSelectedStaffForEdit,
  updateExistingStaff,
} from "../../features/staffSlice";
import {
  fetchAllEmptySelectList,
  selectError,
  selectIsSuccess,
  selectOptionList,
} from "../../features/selectListSlice";
import { selectSelectedStatusForEdit } from "../../features/statusSlice";
import { selectSelectedAccountForEdit } from "../../features/accountSlice";

// NOTE: The Select component (from react-select) that doesn't
// support custom inner props when using component event listener
// (the event object doesn't contains the custom props), so we use
// className props to define the table(data-table) and the field
// name(name) to that Select component (syntax: "<data-table> <name>"),
// the normal input form-control still can use the custom props data-table
// and name.

function StaffModal({ isModalDisplay, type, setModalHide }) {
  let [componentAvailable, setComponentAvailable] = useState(true);
  const dispatch = useDispatch();
  const retriveSelectStatus = useSelector(selectIsSuccess);
  const retriveSelectResult = useSelector(selectOptionList);
  const retriveSelectError = useSelector(selectError);

  const selectedStaffForEdit = useSelector(selectSelectedStaffForEdit);
  const selectedStatusForEdit = useSelector(selectSelectedStatusForEdit);
  const selectedAccountForEdit = useSelector(selectSelectedAccountForEdit);

  const autoGenerate = useAutoGenerate();
  const initialPasswordString = autoGenerate(12);
  const [showPassword, setShowPassword] = useState(false);
  /**
   * Used to convert a Full Name string into Username
   * @param {String} fullName Full Name string
   * @returns a Username that was converted (ex. Nguyen Van Anh => AnhNV)
   */
  const convertFullNameToUsername = (fullName) => {
    const nameArr = fullName.split(" ");
    const lastName = nameArr[nameArr.length - 1];
    let abbreviation = "";
    for (let i = 0; i < nameArr.length - 1; i++) {
      abbreviation += nameArr[i].charAt(0);
    }
    return lastName + abbreviation;
  };
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
  const [selectList, setSelectList] = useState({
    Staff: {
      Gender: {
        fromTable: "Staff",
        list: [
          { "data-table": "Staff", label: "Nam", value: "Nam", name: "Gender" },
          { "data-table": "Staff", label: "Nữ", value: "Nữ", name: "Gender" },
        ],
      },
      Company: {
        fromTable: "Collaboratory",
        list: [] /* { "data-table": "", value: "", label: "", name: "" } */,
      },
      CurrentWorkingPlace: {
        fromTable: "WorkingPlace",
        list: [] /* { "data-table": "", value: "", label: "", name: "" } */,
      },
      RoleType: {
        fromTable: "Role",
        list: [] /* { "data-table": "", value: "", label: "", name: "" } */,
      },
    },
    Status: {
      WorkingType: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "Intern",
            value: "Intern",
            name: "WorkingType",
          },
          {
            "data-table": "Status",
            label: "Probation",
            value: "Probation",
            name: "WorkingType",
          },
          {
            "data-table": "Status",
            label: "Official",
            value: "Official",
            name: "WorkingType",
          },
        ],
      },
      WorkingStatus: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "Working from home",
            value: "Working from home",
            name: "WorkingStatus",
          },
          {
            "data-table": "Status",
            label: "Working in department",
            value: "Working in department",
            name: "WorkingStatus",
          },
          {
            "data-table": "Status",
            label: "On-site with client",
            value: "On-site with client",
            name: "WorkingStatus",
          },
          {
            "data-table": "Status",
            label: "Leaving",
            value: "Leaving",
            name: "WorkingStatus",
          },
        ],
      },
      MarriageStatus: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "Maried",
            value: "Maried",
            name: "MarriageStatus",
          },
          {
            "data-table": "Status",
            label: "Single",
            value: "Single",
            name: "MarriageStatus",
          },
        ],
      },
      HealthStatus: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "Normally",
            value: "Normally",
            name: "HealthStatus",
          },
          {
            "data-table": "Status",
            label: "Having diseases",
            value: "Having diseases",
            name: "HealthStatus",
          },
          {
            "data-table": "Status",
            label: "Pregnants",
            value: "Pregnants",
            name: "HealthStatus",
          },
          {
            "data-table": "Status",
            label: "Taking care babies",
            value: "Taking care babies",
            name: "HealthStatus",
          },
        ],
      },
      Covid19Vaccinated: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "Not vaccinated",
            value: "Not vaccinated",
            name: "Covid19Vaccinated",
          },
          {
            "data-table": "Status",
            label: "1 time vaccinated",
            value: "1 time vaccinated",
            name: "Covid19Vaccinated",
          },
          {
            "data-table": "Status",
            label: "2 time vaccinated",
            value: "2 time vaccinated",
            name: "Covid19Vaccinated",
          },
        ],
      },
      Covid19VaccineType: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "AZD1222 (Astra Zeneca)",
            value: "AZD1222 (Astra Zeneca)",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Sputnik-V (Gamalaya)",
            value: "Sputnik-V (Gamalaya)",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Vero-Cell (Sinopharm)",
            value: "Vero-Cell (Sinopharm)",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Corminaty (Pfizer BioNTect)",
            value: "Corminaty (Pfizer BioNTect)",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Spikevax (Covid-19 vaccine Mordena)",
            value: "Spikevax (Covid-19 vaccine Mordena)",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Covid-19 vaccine Janssen",
            value: "Covid-19 vaccine Janssen",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Vaccine Hayat-Vax",
            value: "Vaccine Hayat-Vax",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Vaccine Abdala (AICA)",
            value: "Vaccine Abdala (AICA)",
            name: "Covid19VaccineType",
          },
        ],
      },
    },
    Account: {
      Domain: {
        fromTable: "Collaboratory",
        list: [],
      },
    },
  });

  // define the data object that used for display and upload to
  // airtable the key name is the looked up value (read-only)
  // the 'linkedField' property is the actual field that
  // the new record will be add by this linkedField,
  // the field key and the linkedField is looked up field if
  // they are the sameÎ
  const [newStaffForm, setNewStaffForm] = useState({
    ...initialStaffForm,
    Account: {
      ...initialStaffForm.Account,
      Password: {
        ...initialStaffForm.Account.Password,
        value: initialPasswordString,
        label: initialPasswordString,
      },
    },
  });
  useEffect(() => {
    if (
      type === "edit" &&
      selectedStaffForEdit &&
      selectedStatusForEdit &&
      selectedAccountForEdit
    ) {
      console.log("update");
      setNewStaffForm((state) => {
        let newState = state;
        // set for Staff
        Object.entries(newState.Staff).forEach((formField) => {
          const valueOfFieldsSelected =
            selectedStaffForEdit.fields[formField[0]];
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
              newState.Account[formField[0]].label = valueOfFieldsSelected.url;
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
      });
    }
  }, [
    type,
    selectedStaffForEdit,
    selectedStatusForEdit,
    selectedAccountForEdit,
  ]);

  // define the error status and message
  const [errorForm, setErrorForm] = useState({
    errStatus: false,
    isShowMsg: false,
    errMsg: {
      Staff: {
        FullName: "",
        Gender: "",
        DOB: "",
        Phone: "",
        Company: "",
      },
      Status: {
        WorkingType: "",
        WorkingStatus: "",
        StartWorkingDay: "",
      },
    },
  });

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
    if (e === null) {
      // when clearing a single select input
      setNewStaffForm((state) => {
        const { "data-table": dataTable, name } = action.removedValues[0];
        const newState = { ...state };
        newState[dataTable][name].value = "";
        newState[dataTable][name].label = "";
        return newState;
      });
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
          if (name === "FullName") {
            const newUsername = convertFullNameToUsername(value);
            const currentDomain = newState.Account.Domain.label;
            newState.Account.Username.value = newUsername;
            newState.Account.Username.label = newUsername;
            newState.Account.UserAccount.value = newUsername + currentDomain;
            newState.Account.UserAccount.label = newUsername + currentDomain;
          }
          return newState;
        });
      } else if (e.filesFailed && e.filesUploaded) {
        // used for image upload (Filestack handler)
        // filesFailed, filesUploaded are arrays
        if (e.filesUploaded.length > 0) {
          setNewStaffForm((state) => {
            let newState = { ...state };
            const { name, "data-table": dataTable, filesUploaded } = e;
            newState[dataTable][name].value = [filesUploaded[0]];
            newState[dataTable][name].label = filesUploaded[0].url;
            return newState;
          });
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
          } else {
            // single select
            const { "data-table": dataTable, name, value, label } = e;
            const newState = { ...state };
            if (name === "Company") {
              const username = newState.Account.Username;
              const domain = newState.Account.Domain;
              const userAccount = newState.Account.UserAccount;
              domain.value = value;
              domain.label = selectList.Account.Domain.list.find(
                (item) => item.value === value
              ).label;
              userAccount.value = username.value + domain.value;
              userAccount.label = username.label + domain.label;
            }
            newState[dataTable][name].value = value;
            newState[dataTable][name].label = label;
          }
          return newState;
        });
      }
    }
  };

  // Validate, Clear error message on focus and Submit
  const handleValidate = () => {
    // define the validator for the form
    setErrorForm((state) => {
      let newErr = { ...state };
      newErr.errStatus = false;
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
  // the clear error msg trigger on form-group that
  // have required tag only used with onFocus
  const handleClearErrMsgOnFocus = (e) => {
    let name = "";
    let dataTable = "";
    // DatePicker input
    if (e.inputType && e.inputType === "DatePicker") {
      name = e.target.name;
      dataTable = e.target["data-table"];
    } else if (e.target.className === "") {
      // select input
      const inputElement =
        e.target.parentElement.parentElement.parentElement.parentElement;
      name = inputElement.classList[1];
      dataTable = inputElement.classList[0];
    } else {
      // normal input
      name = e.target.attributes.name.nodeValue;
      dataTable = e.target.attributes["data-table"].nodeValue;
    }
    setErrorForm((state) => {
      let newState = { ...state };
      newState.errMsg[dataTable][name] = "";
      return newState;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newStaffForm);
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
    Object.keys(newRecord).forEach((key) => {
      Object.entries(newStaffForm[key]).forEach((item) => {
        newRecord[key][newStaffForm[key][item[0]].linkedField] =
          item[0] === item[1].linkedField ? item[1].value : [item[1].value];
      });
    });
    let countRecordCreated = 0;
    // create new record into Staff first to get the recordId then create others
    // createNewRecord("Staff", newRecord.Staff)
    //   .then((res) => {
    //     console.log("Create new record in Staff table successfully!", res);
    //     countRecordCreated++;
    //     const recordId = res.id;
    //     Object.entries(newRecord).forEach((item) => {
    //       const table = item[0];
    //       const fields = item[1];
    //       fields.Staff = [recordId]; // add field Staff to the new record
    //       table !== "Staff" &&
    //         createNewRecord(table, fields)
    //           .then((res) => {
    //             console.log(
    //               "Create new record in " + table + " table successfully!",
    //               res
    //             );
    //             countRecordCreated++;
    //           })
    //           .catch((e) => console.log(e))
    //           .finally(() => {
    //             if (countRecordCreated === 3) dispatch(setLoading(false));
    //           });
    //     });
    //   })
    //   .catch((e) => console.log(e));

    // create/update for Staff table
    try {
      const result = await dispatch(
        type === "create"
          ? createNewStaff(newRecord.Staff)
          : updateExistingStaff(newRecord.Staff)
      );
      console.log(result);
      if (result) {
        setModalHide();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal setModalHide={setModalHide} isModalDisplay={isModalDisplay}>
      <Row className="py-4 justify-content-center">
        <Col columnSize={["auto"]}>
          <h1 className="font-weight-bold">Add new staff</h1>
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
            onFocus={handleClearErrMsgOnFocus}
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
            onFocus={handleClearErrMsgOnFocus}
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
            onFocus={handleClearErrMsgOnFocus}
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
            onFocus={handleClearErrMsgOnFocus}
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
            onFocus={handleClearErrMsgOnFocus}
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
            onFocus={handleClearErrMsgOnFocus}
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
            onFocus={handleClearErrMsgOnFocus}
            onBlur={handleValidate}
            value={
              newStaffForm.Status.WorkingType.value && {
                "data-table": "Status",
                label: newStaffForm.Status.WorkingType.label,
                value: newStaffForm.Status.WorkingType.value,
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
            onFocus={handleClearErrMsgOnFocus}
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
        <hr className="navbar-divider"></hr>
        <Row className="justify-content-center mt-5">
          <Col columnSize={["12"]}>
            <Button
              className="px-4 py-3 w-100"
              type="submit"
              onClick={handleSubmit}
            >
              Add new staff
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
};

export default StaffModal;
