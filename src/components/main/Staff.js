import React, { useEffect, useMemo, useState } from "react";
import { retrieveData } from "../../services/airtable.service";
import Card from "../common/Card";
import Col from "../layout/Col";
import MainHeader from "../layout/MainHeader";
import MainContent from "../layout/MainContent";
import Row from "../layout/Row";
import Table from "../common/Table";
import Container from "../layout/Container";
import Button from "../common/Button";
import AddNewStaffModal from "../specific/AddNewStaffModal";
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
        let dataList = [];
        res.forEach((recordData) => {
          dataList.push({
            rowId: recordData.id,
            data: fieldList.map((field) => {
              if (field === "Portrait") {
                return (
                  <div
                    className="cellImg d-flex justify-content-start align-items-center"
                    style={{ height: "40px", overflowY: "hidden" }}
                  >
                    <img
                      src={recordData.fields[field][0].url}
                      width={30}
                      alt=""
                    />
                  </div>
                );
              }
              return (
                <div
                  className="cellImg d-flex justify-content-start align-items-center"
                  style={{ height: "40px", overflowY: "hidden" }}
                >
                  {recordData.fields[field]}
                </div>
              );
            }),
          });
        });
        setRecordList(dataList);
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
            <Col columnSize={["auto"]}>
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
                    itemAmountPerPage={7}
                    isSearchable
                  />,
                ]}
                noBody
              />
            </Col>
          </Row>
        </Container>
      </MainContent>
      <AddNewStaffModal
        isModalDisplay={isModalDisplay}
        setModalHide={() => setModalDisplay(false)}
        setShowLoader={(v) => setShowLoader(v)}
      />
      {showLoader && <Loader />}
    </>
  );
}

export default Staff;
