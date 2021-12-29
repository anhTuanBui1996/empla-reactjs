import React, { useEffect, useMemo, useState } from "react";
import {
  mapResultToTableData,
  retrieveData,
} from "../../services/airtable.service";
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

function Staff() {
  const [showLoader, setShowLoader] = useState(false);
  const [recordList, setRecordList] = useState([]);
  const [isModalDisplay, setModalDisplay] = useState(false);
  const fieldList = useMemo(() => {
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
  useEffect(() => {
    setShowLoader(true);
    retrieveData("Staff")
      .then((res) => {
        const dataTableList = mapResultToTableData(res, fieldList);
        setRecordList(dataTableList);
      })
      .catch((e) => console.log(e))
      .finally(() => setShowLoader(false));
  }, [fieldList]);
  return (
    <>
      <MainContent isPopupOpened={isModalDisplay}>
        <MainHeader title="Staff" subTitle="All of your employee is here" />
        <Container fluid>
          <Row>
            <Col columnSize={["12", "lg-auto"]}>
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
                        onClick={() => setModalDisplay(true)}
                      >
                        Add staff
                      </Button>
                    </Row>
                  </Col>,
                ]}
              />
            </Col>
            <Col columnSize={["12", "lg-auto"]}></Col>
          </Row>
          <Row>
            <Col columnSize={["12"]}>
              <Card
                cardHeader={{
                  title: "Your employee list",
                  badge: {
                    label: "All",
                    theme: "secondary",
                  },
                  extension: true,
                }}
                elementList={[
                  <Table
                    fieldList={fieldList}
                    recordList={recordList}
                    isHasSettings
                  />,
                ]}
                noBodyPadding
              />
            </Col>
          </Row>
        </Container>
      </MainContent>
      <StaffModal
        isModalDisplay={isModalDisplay}
        setModalHide={() => setModalDisplay(false)}
        setShowLoader={(v) => setShowLoader(v)}
      />
      {showLoader && <Loader />}
    </>
  );
}

export default Staff;
