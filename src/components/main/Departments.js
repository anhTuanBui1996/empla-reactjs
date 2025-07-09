import React from "react";
import MainContent from "../layout/MainContent";
import MainHeader from "../layout/MainHeader";
import Container from "../layout/Container";
import Row from "../layout/Row";
import Col from "../layout/Col";
import TableEditorCard from "../editor/TableEditorCard";

function Departments() {
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
                cardLabel="Departments"
                tableInfoArr={[
                  {
                    tableName: "WorkingPlace",
                    tableLabel: "WorkingPlace",
                    fieldList: [
                      "Name",
                      "Address",
                      "District",
                      "City",
                      "Country",
                    ],
                  },
                  {
                    tableName: "Collaboratory",
                    tableLabel: "Collaboratory",
                    fieldList: ["Name", "IsCollaboratory", "Domain"],
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

export default Departments;
