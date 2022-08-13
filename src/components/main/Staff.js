import React, { useEffect, useMemo, useState } from "react";
import { mapResultToTableData } from "../../services/airtable.service";
import Card from "../common/Card";
import Col from "../layout/Col";
import MainHeader from "../layout/MainHeader";
import MainContent from "../layout/MainContent";
import Row from "../layout/Row";
import Table from "../common/Table";
import Container from "../layout/Container";
import Button from "../common/Button";
import StaffModal from "../specific/StaffModal";
import Loader from "../common/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  retrieveStaffList,
  selectLoading as staffLoading,
  selectIsSuccess as staffIsSuccess,
  selectError as staffError,
  selectStaffTableData,
  setSelectedStaffForEdit,
  setProgressing as staffProgressSet,
} from "../../features/staffSlice";
import {
  retrieveStatusList,
  selectLoading as statusLoading,
  selectIsSuccess as statusIsSuccess,
  selectError as statusError,
  selectStatusTableData,
  setSelectedStatusForEdit,
  setProgressing as statusProgressSet,
} from "../../features/statusSlice";
import {
  retrieveAccountList,
  selectLoading as accountLoading,
  selectIsSuccess as accountIsSuccess,
  selectError as accountError,
  selectAccountTableData,
  setSelectedAccountForEdit,
  setProgressing as accountProgressSet,
} from "../../features/accountSlice";
import BirthdayScheduler from "../specific/BirthdayScheduler";
import { MdCelebration } from "react-icons/md";
import newStaffImg from "./../../assets/images/welcome-new-staff.jpeg";
import { useToasts } from "react-toast-notifications";
import { selectInnerWidth } from "../../features/windowSlice";
import { selectLoading } from "../../features/logsSlice";

function Staff() {
  const innerWidth = useSelector(selectInnerWidth);

  const _staff_loading = useSelector(staffLoading);
  const _staff_retrieveStatus = useSelector(staffIsSuccess);
  const _staff_retrieveResult = useSelector(selectStaffTableData);
  const _staff_retrieveError = useSelector(staffError);
  const _status_loading = useSelector(statusLoading);
  const _status_retrieveStatus = useSelector(statusIsSuccess);
  const _status_retrieveResult = useSelector(selectStatusTableData);
  const _status_retrieveError = useSelector(statusError);
  const _account_loading = useSelector(accountLoading);
  const _account_retrieveStatus = useSelector(accountIsSuccess);
  const _account_retrieveResult = useSelector(selectAccountTableData);
  const _account_retrieveError = useSelector(accountError);

  const _logLoading = useSelector(selectLoading);

  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [_staff_recordList, _staff_setRecordList] = useState([]);
  const [_status_recordList, _status_setRecordList] = useState([]);
  const [_account_recordList, _account_setRecordList] = useState([]);
  const [isModalDisplay, setModalDisplay] = useState(false);
  const [modalType, setModalType] = useState("create");
  const staffFieldList = useMemo(() => {
    return [
      "StaffId",
      "FullName",
      "Portrait",
      "Gender",
      "DOB",
      "Phone",
      "PersonalEmail",
      "RoleType",
      "Company",
      "CurrentWorkingPlace",
    ];
  }, []);
  const statusFieldList = useMemo(() => {
    return [
      "StaffId",
      "WorkingType",
      "WorkingStatus",
      "StartWorkingDay",
      "MarriageStatus",
      "HealthStatus",
      "Notes",
      "Covid19Vaccinated",
      "Covid19VaccineType",
    ];
  }, []);
  const accountFieldList = useMemo(() => {
    return [
      "StaffId",
      "Username",
      "Domain",
      "UserAccount",
      "Password",
      "FullName",
      "Avatar",
      "CreatedTime",
      "LastModifiedTime",
      "AccountStatus",
    ];
  }, []);

  // Staff table retrieve progression
  useEffect(() => {
    if (_staff_retrieveResult) {
      const staffDataTableList = mapResultToTableData(
        _staff_retrieveResult,
        staffFieldList
      );
      _staff_setRecordList(staffDataTableList);
      dispatch(staffProgressSet(null));
    } else {
      if (_staff_retrieveStatus) {
        if (_staff_retrieveError) {
          console.log(_staff_retrieveError);
          addToast(
            "Retrieve Staff Data failed! Please check your connection...",
            { appearance: "error" }
          );
        }
      } else {
        dispatch(retrieveStaffList());
      }
    }
  }, [
    staffFieldList,
    _staff_retrieveStatus,
    _staff_retrieveResult,
    _staff_retrieveError,
    dispatch,
    addToast,
  ]);

  // Status table retrieve progression
  useEffect(() => {
    if (_status_retrieveResult) {
      const statusDataTableList = mapResultToTableData(
        _status_retrieveResult,
        statusFieldList
      );
      _status_setRecordList(statusDataTableList);
      dispatch(statusProgressSet(null));
    } else {
      if (_status_retrieveStatus) {
        if (_status_retrieveError) {
          console.log(_status_retrieveError);
          addToast(
            "Retrieve Status Data failed! Please check your connection...",
            { appearance: "error" }
          );
        }
      } else {
        dispatch(retrieveStatusList());
      }
    }
  }, [
    statusFieldList,
    _status_retrieveStatus,
    _status_retrieveResult,
    _status_retrieveError,
    dispatch,
    addToast,
  ]);

  // Account table retrieve progression
  useEffect(() => {
    if (_account_retrieveResult) {
      const accountDataTableList = mapResultToTableData(
        _account_retrieveResult,
        accountFieldList
      );
      _account_setRecordList(accountDataTableList);
      dispatch(accountProgressSet(null));
    } else {
      if (_account_retrieveStatus) {
        if (_account_retrieveError) {
          console.log(_account_retrieveError);
          addToast(
            "Retrieve Account Data failed! Please check your connection...",
            { appearance: "error" }
          );
        }
      } else {
        dispatch(retrieveAccountList());
      }
    }
  }, [
    accountFieldList,
    _account_retrieveStatus,
    _account_retrieveResult,
    _account_retrieveError,
    dispatch,
    addToast,
  ]);

  const handleOpenModalForCreate = () => {
    setModalType("create");
    setModalDisplay(true);
    dispatch(setSelectedStaffForEdit(null));
    dispatch(setSelectedStatusForEdit(null));
    dispatch(setSelectedAccountForEdit(null));
  };
  const handleOpenModalForEdit = () => {
    setModalType("edit");
    setModalDisplay(true);
  };

  return (
    <>
      <MainContent>
        <MainHeader title="Staff" subTitle="All of your employee is here" />
        <Container fluid gap={20}>
          <Row style={{ gap: innerWidth < 992 ? "20px" : "" }}>
            <Col columnSize={["12", "lg-6"]}>
              <Card
                cardHeader={{
                  title: "Quick New Staff",
                  extension: true,
                }}
                isHasHideCard
                elementList={[
                  <Col columnSize={["auto"]}>
                    <Row style={{ marginBottom: "7.69px" }}>
                      <p>Create a new staff to the database</p>
                    </Row>
                    <Row
                      className={`justify-content-${
                        innerWidth < 389 ? "center" : "between"
                      } align-items-baseline`}
                    >
                      <img alt="" src={newStaffImg} width={200} height={110} />
                      <Button
                        className="py-2 px-4"
                        onClick={handleOpenModalForCreate}
                      >
                        Add staff
                      </Button>
                    </Row>
                  </Col>,
                ]}
              />
            </Col>
            <Col columnSize={["12", "lg-6"]}>
              <Card
                cardHeader={{
                  title: (
                    <span>
                      Birthday of staffs <MdCelebration size={20} />
                    </span>
                  ),
                  extension: true,
                }}
                isHasHideCard
                elementList={[
                  <BirthdayScheduler events={_status_retrieveResult} />,
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col columnSize={["12"]}>
              <Card
                cardHeader={{
                  title: "Your employee information",
                  extension: true,
                  navList: ["Staff", "Status", "Account"],
                }}
                isHasHideCard
                elementList={[
                  <Table
                    tableName="Staff"
                    fieldList={staffFieldList}
                    recordList={_staff_recordList}
                    isHasSettings
                    forEditing={{
                      syncTables: [
                        _staff_retrieveResult,
                        _status_retrieveResult,
                        _account_retrieveResult,
                      ],
                      syncField: "StaffId",
                      syncReducers: [
                        setSelectedStaffForEdit,
                        setSelectedStatusForEdit,
                        setSelectedAccountForEdit,
                      ],
                    }}
                    onRecordClick={handleOpenModalForEdit}
                  />,
                  <Table
                    tableName="Status"
                    fieldList={statusFieldList}
                    recordList={_status_recordList}
                    isHasSettings
                    forEditing={{
                      syncTables: [
                        _staff_retrieveResult,
                        _status_retrieveResult,
                        _account_retrieveResult,
                      ],
                      syncField: "StaffId",
                      syncReducers: [
                        setSelectedStaffForEdit,
                        setSelectedStatusForEdit,
                        setSelectedAccountForEdit,
                      ],
                    }}
                    onRecordClick={handleOpenModalForEdit}
                  />,
                  <Table
                    tableName="Account"
                    fieldList={accountFieldList}
                    recordList={_account_recordList}
                    isHasSettings
                    forEditing={{
                      syncTables: [
                        _staff_retrieveResult,
                        _status_retrieveResult,
                        _account_retrieveResult,
                      ],
                      syncField: "StaffId",
                      syncReducers: [
                        setSelectedStaffForEdit,
                        setSelectedStatusForEdit,
                        setSelectedAccountForEdit,
                      ],
                    }}
                    onRecordClick={handleOpenModalForEdit}
                  />,
                ]}
                isLoading={
                  _staff_recordList.length ||
                  _status_recordList.length ||
                  _account_recordList.length
                    ? false
                    : true
                }
                noBodyPadding
              />
            </Col>
          </Row>
        </Container>
      </MainContent>
      <StaffModal
        isModalDisplay={isModalDisplay}
        type={modalType}
        setModalHide={() => setModalDisplay(false)}
      />
      {(_staff_loading ||
        _status_loading ||
        _account_loading ||
        _logLoading) && <Loader />}
    </>
  );
}

export default Staff;
