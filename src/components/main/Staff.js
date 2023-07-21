import React, {  } from "react";
import Card from "../common/Card";
import Col from "../layout/Col";
import MainHeader from "../layout/MainHeader";
import MainContent from "../layout/MainContent";
import Row from "../layout/Row";
import Container from "../layout/Container";
import { useSelector } from "react-redux";
import BirthdayScheduler from "../specific/BirthdayScheduler";
import { MdCelebration } from "react-icons/md";
import TableEditorCard from "../editor/TableEditorCard";
import { selectStaffTableData } from "../../features/staffSlice";

function Staff() {
  const staff_retrieveResult = useSelector(selectStaffTableData);

  return (
    <>
      <MainContent>
        <MainHeader title="Staff" subTitle="All of your employee is here" />
        <Container fluid gap={20}>
          <Row>
            <Col columnSize={["12"]}>
              <Card
                cardHeader={{
                  title: (
                    <span>
                      Birthday of staffs <MdCelebration size={20} />
                    </span>
                  ),
                }}
                elementList={[
                  <BirthdayScheduler events={staff_retrieveResult} />,
                ]}
              />
            </Col>
            <Col columnSize={["12"]}>
              <TableEditorCard
                cardLabel="Employee/Staff Information"
                tableInfoArr={[
                  {
                    tableName: "Staff",
                    tableLabel: "Staff/Employee",
                    fieldList: [
                      "FullName",
                      "Portrait",
                      "Gender",
                      "DateOfBirth",
                      "Phone",
                      "PersonalEmail",
                      "RoleType",
                      "Company",
                      "CurrentWorkingPlace",
                      "ContractType",
                      "WorkingType",
                      "WorkingPeriod",
                      "WorkingStatus",
                      "StartWorkingDay",
                      "MarriageStatus",
                      "HealthStatus",
                      "CurriculumVitae",
                      "Notes",
                      "Username",
                      "Domain",
                      "Account",
                      "Password",
                      "Avatar",
                      "CreatedTime",
                      "LastModifiedTime",
                      "AccountStatus",
                    ],
                  },
                ]}
              />
            </Col>
          </Row>
        </Container>
      </MainContent>
    </>
  );
}

export default Staff;
