import React from "react";
import Container from "../layout/Container";
import Row from "../layout/Row";
import Col from "../layout/Col";
import MainContent from "../layout/MainContent";
import MainHeader from "../layout/MainHeader";
import TableEditorCard from "../editor/TableEditorCard";

function Role() {
  return (
    <>
      <MainContent>
        <MainHeader
          title="Control your company roles"
          subTitle="Your company administrators and employee"
        />
        <Container fluid>
          <Row>
            <Col columnSize={["12"]}>
              <TableEditorCard
                cardLabel="Role Information"
                tableInfoArr={[
                  {
                    tableName: "Role",
                    tableLabel: "Role",
                    fieldList: [
                      "Name",
                      "IsLeader",
                      "DatabaseAccessibility",
                      "DepartmentName",
                      "Description",
                      "Create",
                      "Read",
                      "Update",
                      "Delete",
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

export default Role;
