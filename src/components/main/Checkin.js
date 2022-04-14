import React, { useEffect, useMemo, useState } from "react";
import MainContent from "../layout/MainContent";
import MainHeader from "../layout/MainHeader";
import Card from "../common/Card";
import Col from "../layout/Col";
import Row from "../layout/Row";
import Container from "../layout/Container";
import Table from "../common/Table";
import { mapResultToTableData } from "../../services/airtable.service";
import { selectUserCredential } from "../../features/userSlice";
import { useSelector } from "react-redux";
import Loader from "../common/Loader";
import {
  selectCheckinTableData,
  selectLoading,
} from "../../features/checkinSlice";
import QuickCheckinCard from "../specific/QuickCheckinCard";
import BigCalendar from "../specific/BigCalendar";
import { MdSummarize } from "react-icons/md";
import CheckInMap from "../specific/CheckInMap";

function Checkin() {
  const fieldList = useMemo(() => {
    return ["RecordId", "CreatedDate", "Type", "Notes"];
  }, []);
  const [recordList, setRecordList] = useState([]);
  const userCredential = useSelector(selectUserCredential);

  const loading = useSelector(selectLoading);
  const checkinList = useSelector(selectCheckinTableData);

  /* eslint-disable */
  useEffect(() => {
    if (checkinList) {
      const tableDataList = mapResultToTableData(checkinList, fieldList);
      setRecordList(
        tableDataList.sort((a, b) => {
          const firstCreatedTime = Date.parse(a.data[1]);
          const secondCreatedTime = Date.parse(b.data[1]);
          return secondCreatedTime - firstCreatedTime;
        })
      );
    }
  }, [userCredential, checkinList]);

  // for now, we only support consecutive day check-in in the same month, year
  // the technical for fill time consecutive day check-in will need develope more
  // in the useMemo hook of eventList below
  const eventList = useMemo(() => {
    let newRecordList = [];
    for (let i = 0; i < recordList.length; i = i + 2) {
      const record = recordList[i];
      const nextRecord = recordList[i + 1];
      if (!nextRecord) break;
      const createdTimeStart = new Date(nextRecord.data[1]);
      const createdTimeEnd = new Date(record.data[1]);
      const checkTypeStart = nextRecord.data[2];
      const checkTypeEnd = record.data[2];
      const isWeekendWorking =
        createdTimeStart.getDay() < 1 || createdTimeStart.getDay() > 5
          ? true
          : false;

      if (createdTimeStart.getDate() !== createdTimeEnd.getDate()) {
        let difDate = createdTimeEnd.getDate() - createdTimeStart.getDate();
        newRecordList.push({
          title: "Daily check-in",
          start: createdTimeStart,
          end: new Date(
            createdTimeStart.getFullYear(),
            createdTimeStart.getMonth(),
            createdTimeStart.getDate(),
            23,
            59,
            59
          ),
          allDay: false,
          resource: {
            start: {
              recordId: nextRecord.data[0],
              type: checkTypeStart,
              notes: nextRecord.data[3],
            },
            end: {
              recordId: record.data[0],
              type: checkTypeEnd,
              notes: record.data[3],
            },
            style: {
              backgroundColor: isWeekendWorking ? "#BC1800" : "",
            },
          },
        });
        if (difDate > 1) {
          for (
            let j = createdTimeStart.getDate() + 1;
            j < createdTimeEnd.getDate();
            j++
          ) {
            newRecordList.push({
              title: "Daily check-in",
              start: new Date(
                createdTimeStart.getFullYear(),
                createdTimeStart.getMonth(),
                j,
                0,
                0,
                1
              ),
              end: new Date(
                createdTimeEnd.getFullYear(),
                createdTimeEnd.getMonth(),
                j,
                23,
                59,
                59
              ),
              allDay: false,
              resource: {
                start: {
                  recordId: nextRecord.data[0],
                  type: checkTypeStart,
                  notes: nextRecord.data[3],
                },
                end: {
                  recordId: record.data[0],
                  type: checkTypeEnd,
                  notes: record.data[3],
                },
                style: {
                  backgroundColor: isWeekendWorking ? "#BC1800" : "",
                },
              },
            });
          }
        }
        newRecordList.push({
          title: "Daily check-in",
          start: new Date(
            createdTimeEnd.getFullYear(),
            createdTimeEnd.getMonth(),
            createdTimeEnd.getDate(),
            0,
            0,
            1
          ),
          end: createdTimeEnd,
          allDay: false,
          resource: {
            start: {
              recordId: nextRecord.data[0],
              type: checkTypeStart,
              notes: nextRecord.data[3],
            },
            end: {
              recordId: record.data[0],
              type: checkTypeEnd,
              notes: record.data[3],
            },
            style: {
              backgroundColor: isWeekendWorking ? "#BC1800" : "",
            },
          },
        });
      } else {
        newRecordList.push({
          title: "Daily check-in",
          start: createdTimeStart,
          end: createdTimeEnd,
          allDay: false,
          resource: {
            start: {
              recordId: nextRecord.data[0],
              type: checkTypeStart,
              notes: nextRecord.data[3],
            },
            end: {
              recordId: record.data[0],
              type: checkTypeEnd,
              notes: record.data[3],
            },
            style: {
              backgroundColor: isWeekendWorking ? "#BC1800" : "",
            },
          },
        });
      }
    }
    return newRecordList;
  }, [recordList]);
  return (
    <>
      {loading && <Loader />}
      <MainContent>
        <MainHeader
          title="Check-in"
          subTitle="Check-in before working and check-out before leaving. Remember!"
        />
        <Container fluid>
          <Row className="justify-content-between">
            <Col columnSize={["12", "lg-6"]}>
              <Row>
                <Col columnSize={["12"]}>
                  <QuickCheckinCard />
                </Col>
              </Row>
              <Row>
                <Col columnSize={["12"]}>
                  <CheckInMap />
                </Col>
              </Row>
            </Col>
            <Col columnSize={["12", "lg-6"]}>
              <BigCalendar
                title={
                  <span className="working-day-summary">
                    Working Day Summary <MdSummarize color="blue" />
                  </span>
                }
                events={eventList}
              />
            </Col>
          </Row>
          <Row>
            <Col columnSize={["12"]}>
              <Card
                isLoading={loading}
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

export default Checkin;
