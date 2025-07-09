import React from "react";
import MainContent from "../layout/MainContent";
import MainHeader from "../layout/MainHeader";
import Container from "../layout/Container";
import Row from "../layout/Row";
import Col from "../layout/Col";
import TableEditorCard from "../editor/TableEditorCard";

function Tasks() {
  return (
    <>
      <MainContent>
        <MainHeader
          title="All your company departments"
          subTitle="Control your working place and collaboratory"
        />
        <Container fluid>
          <Row>
            <Col columnSize={["12"]}>
              <TableEditorCard
                cardLabel="Tasks"
                tableInfoArr={[
                  {
                    tableName: "Tasks",
                    tableLabel: "Tasks",
                    fieldList: [
                      "Name",
                      "Description",
                      "Status",
                      "StartDate",
                      "FinishDate",
                      "AssignedTo",
                      "Staff_AssignedTo",
                      "StaffAccount_AssignedTo",
                      "Supervisor",
                      "Staff_Supervisor",
                      "StaffAccount_Supervisor",
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

export default Tasks;
