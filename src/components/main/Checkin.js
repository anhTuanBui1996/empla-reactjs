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
import useTimeCounter from "../hooks/useTimeCounter";

function Checkin() {
  // start the time counter
  useTimeCounter();

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
              <QuickCheckinCard />
            </Col>
            <Col columnSize={["12", "md-auto"]}>
              <BigCalendar
                title={
                  <span className="working-day-summary">
                    Working Day Summary <MdSummarize color="blue" />
                  </span>
                }
                events={mapCheckinListToEvents(recordList)}
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

const mapCheckinListToEvents = (recordList) => {
  let newRecordList = [];
  for (let i = 0; i < recordList.length; i = i + 2) {
    const record = recordList[i];
    const nextRecord = recordList[i + 1];
    if (!nextRecord) break;
    const createdTimeStart = new Date(nextRecord.data[1]);
    const createdTimeEnd = new Date(record.data[1]);
    const checkTypeStart = nextRecord.data[2];
    const checkTypeEnd = record.data[2];
    const isWorkingOvertime =
      createdTimeStart.getDay() < 1 || createdTimeStart.getDay() > 5
        ? true
        : false;
    newRecordList.push({
      title: `${isWorkingOvertime ? "Overtime" : "Daily"} check-in`,
      start: createdTimeStart,
      end: createdTimeEnd,
      allDay: false,
      resource: {
        isWorkingOvertime,
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
          backgroundColor: isWorkingOvertime ? "#BC1800" : "",
        },
      },
    });
  }
  return newRecordList;
};

export default Checkin;
