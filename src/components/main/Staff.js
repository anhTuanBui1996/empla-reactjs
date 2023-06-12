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
// import LeftSideFormModal from "../editor/LeftSideFormModal";
import LeftSideFormModal from "../editor/leftSideFormModal/LeftSideFormModal";
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
import BirthdayScheduler from "../specific/BirthdayScheduler";
import { MdCelebration } from "react-icons/md";
import newStaffImg from "./../../assets/images/welcome-new-staff.jpeg";
import { useToasts } from "react-toast-notifications";
import { selectInnerWidth } from "../../features/windowSlice";
import { selectLoading } from "../../features/logsSlice";
import InitialStaffForm, {
  isRequiredFields,
} from "../../assets/forms/staffForm";

function Staff() {
  const innerWidth = useSelector(selectInnerWidth);

  const _staff_loading = useSelector(staffLoading);
  const _staff_retrieveStatus = useSelector(staffIsSuccess);
  const _staff_retrieveResult = useSelector(selectStaffTableData);
  const _staff_retrieveError = useSelector(staffError);

  const _logLoading = useSelector(selectLoading);

  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [_info_recordList, _info_setRecordList] = useState([]);
  const [_status_recordList, _status_setRecordList] = useState([]);
  const [_account_recordList, _account_setRecordList] = useState([]);
  const [isModalDisplay, setModalDisplay] = useState(false);
  const [modalType, setModalType] = useState("create");
  const infoFieldList = useMemo(() => {
    return [
      "FullName",
      "Portrait",
      "Gender",
      "DateOfBirth",
      "Phone",
      "PersonalEmail",
      "RoleType",
      "Company",
      "CurrentWorkingPlace",
    ];
  }, []);
  const statusFieldList = useMemo(() => {
    return [
      "ContractType",
      "WorkingType",
      "WorkingPeriod",
      "WorkingStatus",
      "StartWorkingDay",
      "MarriageStatus",
      "HealthStatus",
      "CurriculumVitae",
      "Notes",
    ];
  }, []);
  const accountFieldList = useMemo(() => {
    return [
      "Username",
      "Domain",
      "Account",
      "Password",
      "Avatar",
      "CreatedTime",
      "LastModifiedTime",
      "AccountStatus",
    ];
  }, []);

  // Staff table retrieve progression
  useEffect(() => {
    if (_staff_retrieveResult) {
      const infoDataTableList = mapResultToTableData(
        _staff_retrieveResult,
        "Staff",
        infoFieldList,
        tableMetadata
      );
      const statusDataTableList = mapResultToTableData(
        _staff_retrieveResult,
        "Staff",
        statusFieldList,
        tableMetadata
      );
      const accountDataTableList = mapResultToTableData(
        _staff_retrieveResult,
        "Staff",
        accountFieldList,
        tableMetadata
      );
      _info_setRecordList(infoDataTableList);
      _status_setRecordList(statusDataTableList);
      _account_setRecordList(accountDataTableList);
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
    infoFieldList,
    statusFieldList,
    accountFieldList,
    _staff_retrieveStatus,
    _staff_retrieveResult,
    _staff_retrieveError,
    dispatch,
    addToast,
    tableMetadata,
  ]);

  const handleOpenModalForCreate = () => {
    setModalType("create");
    setModalDisplay(true);
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
                      <img
                        alt="new-staff-img"
                        src={newStaffImg}
                        width={200}
                        height={110}
                      />
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
                  <BirthdayScheduler events={_staff_retrieveResult} />,
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
                  navList: ["Info", "Status", "Account"],
                }}
                isHasHideCard
                elementList={[
                  <Table
                    fieldList={infoFieldList}
                    tableMappedRecords={_info_recordList}
                    isHasSettings
                    originalRecords={_staff_retrieveResult}
                    onRecordClick={handleOpenModalForEdit}
                  />,
                  <Table
                    fieldList={statusFieldList}
                    tableMappedRecords={_status_recordList}
                    isHasSettings
                    originalRecords={_staff_retrieveResult}
                    onRecordClick={handleOpenModalForEdit}
                  />,
                  <Table
                    fieldList={accountFieldList}
                    tableMappedRecords={_account_recordList}
                    isHasSettings
                    originalRecords={_staff_retrieveResult}
                    onRecordClick={handleOpenModalForEdit}
                  />,
                ]}
                isLoading={_staff_retrieveResult ? false : true}
                noBodyPadding
              />
            </Col>
          </Row>
        </Container>
      </MainContent>
      <LeftSideFormModal
        formName="Staff"
        requiredFields={isRequiredFields}
        isModalDisplay={isModalDisplay}
        type={modalType}
      />
      {/* <LeftSideFormModal
        isModalDisplay={isModalDisplay}
        type={modalType}
        setModalHide={() => setModalDisplay(false)}
      /> */}

      {(_staff_loading || _logLoading || _staff_retrieveResult === null) && (
        <Loader />
      )}
    </>
  );
}

export default Staff;
