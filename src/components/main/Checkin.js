import React, { useEffect, useMemo, useState } from "react";
import MainContent from "../layout/MainContent";
import MainHeader from "../layout/MainHeader";
import Card from "../common/Card";
import Col from "../layout/Col";
import Row from "../layout/Row";
import Button from "../common/Button";
import Container from "../layout/Container";
import Table from "../common/Table";
import { mapResultToTableData } from "../../services/airtable.service";
import { selectUserCredential } from "../../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../common/Loader";
import {
  retriveCheckinList,
  createNewCheckin,
  selectCheckinTableData,
  selectError,
  selectLoading,
  selectNewCheckinData,
  setNewCheckinData,
  setCheckinTableData,
} from "../../features/checkinSlice";
import { MdNoteAdd } from "react-icons/md";
import Outclick from "../../hoc/Outclick";
import styled from "styled-components";
import { useToasts } from "react-toast-notifications";
import useTimeCounter from "../hooks/useTimeCounter";

function Checkin() {
  const timer = useTimeCounter();
  const fieldList = useMemo(() => {
    return ["RecordId", "CreatedDate", "Type", "Notes"];
  }, []);
  const [recordList, setRecordList] = useState([]);
  const [isCheckAvailable, setCheckStatus] = useState(false);
  const [isCheckIn, setCheckIn] = useState(true);
  const [notes, setNotes] = useState("");
  const [isNotesOpened, setOpenNotes] = useState(false);
  const userCredential = useSelector(selectUserCredential);

  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const loading = useSelector(selectLoading);
  const checkinList = useSelector(selectCheckinTableData);
  const error = useSelector(selectError);
  const newCheckin = useSelector(selectNewCheckinData);
  const now = timer();

  /* eslint-disable */
  useEffect(() => {
    if (checkinList || newCheckin) {
      const tableDataList = mapResultToTableData(checkinList, fieldList);
      let lastCheck = tableDataList[0];
      if (lastCheck) {
        tableDataList.forEach((recordData, index) => {
          // the CreatedDate's index is 1 in the fieldList
          const createdTimeStr = recordData.data[1];
          const lastCheckTimeStr = lastCheck.data[1];
          if (Date.parse(createdTimeStr) > Date.parse(lastCheckTimeStr)) {
            lastCheck = recordData;
          }
          const date = new Date(Date.parse(createdTimeStr));
          tableDataList[index].data[1] = date.toUTCString();
        });
        // the Type's index is 2 in the fieldList
        if (lastCheck.data[2] === "Check-in") {
          setCheckIn(false);
        } else {
          setCheckIn(true);
        }

        // we check at least 4 hours for creating a new check-in/out
        const lastCheckTime = Date.parse(lastCheck.data[1]);
        if (now - lastCheckTime >= 4 * 60 * 60 * 1000) {
          setCheckStatus(true);
        }
      } else {
        setCheckStatus(true);
      }

      setRecordList(
        tableDataList.sort((a, b) => {
          const firstCreatedTime = Date.parse(a.data[1]);
          const secondCreatedTime = Date.parse(b.data[1]);
          return secondCreatedTime - firstCreatedTime;
        })
      );
      if (newCheckin) {
        addToast(`Create a new ${newCheckin.fields.Type} successfully!`, {
          appearance: "info",
        });
        dispatch(setNewCheckinData(null));
        dispatch(setCheckinTableData(null));
      }
    } else {
      if (error) {
        console.log(error);
        addToast("An error occurs", { appearance: "error" });
      } else {
        if (userCredential) {
          dispatch(retriveCheckinList(userCredential.StaffId[0]));
        }
      }
    }
  }, [userCredential, checkinList, error, newCheckin, now]);

  const handleCheckIn = (e) => {
    e.preventDefault();
    dispatch(
      createNewCheckin({
        Type: "Check-in",
        Notes: notes,
        Staff: userCredential.Staff,
      })
    );
  };

  const handleCheckOut = (e) => {
    e.preventDefault();
    dispatch(
      createNewCheckin({
        Type: "Check-out",
        Notes: notes,
        Staff: userCredential.Staff,
      })
    );
  };

  return (
    <>
      {loading && <Loader />}
      <MainContent>
        <MainHeader
          title="Check-in"
          subTitle="Check-in before working and check-out before leaving. Remember!"
        />
        <Container fluid>
          <Row>
            <Col columnSize={["12", "md-auto"]}>
              {isCheckAvailable && (
                <Card
                  cardHeader={{
                    title: isCheckIn ? "Check-in" : "Check-out",
                    rightTitle: (
                      <div className="dropdown">
                        <button
                          className="btn btn-info h5 mb-0 px-2 py-2"
                          onClick={() => setOpenNotes(!isNotesOpened)}
                        >
                          <MdNoteAdd size="20px" />
                        </button>
                        <Outclick onOutClick={() => setOpenNotes(false)}>
                          <div
                            className={`dropdown-menu dropdown-menu-right bg-info px-4 py-4${
                              isNotesOpened ? " d-block" : ""
                            }`}
                          >
                            <TextAreaForNotes
                              className="form-coltrol border border-0"
                              placeholder="Addition notes"
                              onChange={(e) => setNotes(e.target.value)}
                              value={notes}
                            />
                          </div>
                        </Outclick>
                      </div>
                    ),
                  }}
                  elementList={[
                    <Col columnSize={["auto"]}>
                      <Row>
                        <p>{`Create a new check-${
                          isCheckIn ? "in" : "out"
                        } for today before working`}</p>
                      </Row>
                      <Row className="justify-content-end">
                        <Button
                          className="py-2 px-4"
                          onClick={isCheckIn ? handleCheckIn : handleCheckOut}
                        >
                          {isCheckIn ? "Check-in" : "Check-out"}
                        </Button>
                      </Row>
                    </Col>,
                  ]}
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col columnSize={["12"]}>
              <Card
                cardHeader={{
                  title: "Check-in/out history",
                  extension: true,
                }}
                elementList={[
                  <Table
                    tableName="Check-in"
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
    </>
  );
}

const TextAreaForNotes = styled.textarea`
  padding: 5px 8px;
  &:active,
  &:focus {
    outline: none !important;
  }
`;

export default Checkin;
