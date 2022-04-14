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
  retriveStaffList,
  selectLoading as staffLoading,
  selectIsSuccess as staffIsSuccess,
  selectError as staffError,
  selectStaffTableData,
  setSelectedStaffForEdit,
  setProgressing as staffProgressSet,
} from "../../features/staffSlice";
import {
  retriveStatusList,
  selectLoading as statusLoading,
  selectIsSuccess as statusIsSuccess,
  selectError as statusError,
  selectStatusTableData,
  setSelectedStatusForEdit,
  setProgressing as statusProgressSet,
} from "../../features/statusSlice";
import {
  retriveAccountList,
  selectLoading as accountLoading,
  selectIsSuccess as accountIsSuccess,
  selectError as accountError,
  selectAccountTableData,
  setSelectedAccountForEdit,
  setProgressing as accountProgressSet,
} from "../../features/accountSlice";
import Scheduler from "../specific/Scheduler";
import { MdCelebration } from "react-icons/md";

function Staff() {
  const _staff_loading = useSelector(staffLoading);
  const _staff_retriveStatus = useSelector(staffIsSuccess);
  const _staff_retriveResult = useSelector(selectStaffTableData);
  const _staff_retriveError = useSelector(staffError);
  const _status_loading = useSelector(statusLoading);
  const _status_retriveStatus = useSelector(statusIsSuccess);
  const _status_retriveResult = useSelector(selectStatusTableData);
  const _status_retriveError = useSelector(statusError);
  const _account_loading = useSelector(accountLoading);
  const _account_retriveStatus = useSelector(accountIsSuccess);
  const _account_retriveResult = useSelector(selectAccountTableData);
  const _account_retriveError = useSelector(accountError);

  const dispatch = useDispatch();
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

  // Staff table retrive progression
  useEffect(() => {
    if (_staff_retriveResult) {
      const staffDataTableList = mapResultToTableData(
        _staff_retriveResult,
        staffFieldList
      );
      _staff_setRecordList(staffDataTableList);
      dispatch(staffProgressSet(null));
    } else {
      if (_staff_retriveStatus) {
        if (_staff_retriveError) {
          console.log(_staff_retriveError);
        }
      } else {
        dispatch(retriveStaffList());
      }
    }
  }, [
    staffFieldList,
    _staff_retriveStatus,
    _staff_retriveResult,
    _staff_retriveError,
    dispatch,
  ]);

  // Status table retrive progression
  useEffect(() => {
    if (_status_retriveResult) {
      const statusDataTableList = mapResultToTableData(
        _status_retriveResult,
        statusFieldList
      );
      _status_setRecordList(statusDataTableList);
      dispatch(statusProgressSet(null));
    } else {
      if (_status_retriveStatus) {
        if (_status_retriveError) {
          console.log(_status_retriveError);
        }
      } else {
        dispatch(retriveStatusList());
      }
    }
  }, [
    statusFieldList,
    _status_retriveStatus,
    _status_retriveResult,
    _status_retriveError,
    dispatch,
  ]);

  // Account table retrive progression
  useEffect(() => {
    if (_account_retriveResult) {
      const accountDataTableList = mapResultToTableData(
        _account_retriveResult,
        accountFieldList
      );
      _account_setRecordList(accountDataTableList);
      dispatch(accountProgressSet(null));
    } else {
      if (_account_retriveStatus) {
        if (_account_retriveError) {
          console.log(_account_retriveError);
        }
      } else {
        dispatch(retriveAccountList());
      }
    }
  }, [
    accountFieldList,
    _account_retriveStatus,
    _account_retriveResult,
    _account_retriveError,
    dispatch,
  ]);

  const handleOpenModalForCreate = () => {
    setModalType("create");
    setModalDisplay(true);
    dispatch(setSelectedStaffForEdit(null));
    dispatch(setSelectedStatusForEdit(null));
    dispatch(setSelectedAccountForEdit(null));
  };

  return (
    <>
      <MainContent>
        <MainHeader title="Staff" subTitle="All of your employee is here" />
        <Container fluid>
          <Row>
            <Col columnSize={["12", "lg-6"]}>
              <Card
                cardHeader={{
                  title: "Quick New Staff",
                }}
                elementList={[
                  <Col columnSize={["auto"]}>
                    <Row>
                      <p>Create a new staff to the database</p>
                    </Row>
                    <Row className="justify-content-end">
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
                elementList={[<Scheduler events={_status_retriveResult} />]}
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
                elementList={[
                  <Table
                    tableName="Staff"
                    fieldList={staffFieldList}
                    recordList={_staff_recordList}
                    isHasSettings
                    isEditable
                    handleOpenEditModal={() => {
                      setModalType("edit");
                      setModalDisplay(true);
                    }}
                  />,
                  <Table
                    tableName="Status"
                    fieldList={statusFieldList}
                    recordList={_status_recordList}
                    isHasSettings
                    isEditable
                    handleOpenEditModal={() => {
                      setModalType("edit");
                      setModalDisplay(true);
                    }}
                  />,
                  <Table
                    tableName="Account"
                    fieldList={accountFieldList}
                    recordList={_account_recordList}
                    isHasSettings
                    isEditable
                    handleOpenEditModal={() => {
                      setModalType("edit");
                      setModalDisplay(true);
                    }}
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
        setModalHide={() => {
          setModalDisplay(false);
          dispatch(setSelectedStaffForEdit(null));
          dispatch(setSelectedStatusForEdit(null));
          dispatch(setSelectedAccountForEdit(null));
        }}
      />
      {(_staff_loading || _status_loading || _account_loading) && <Loader />}
    </>
  );
}

export default Staff;
