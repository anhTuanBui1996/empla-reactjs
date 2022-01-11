import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import useTimeCounter from "../hooks/useTimeCounter";
import { MdNoteAdd } from "react-icons/md";
import styled from "styled-components";
import { selectUserCredential } from "../../features/userSlice";
import {
  selectLoading,
  selectError,
  selectCheckinTableData,
  selectNewCheckinData,
  createNewCheckin,
  retriveCheckinList,
  setNewCheckinData,
  setCheckinTableData,
} from "../../features/checkinSlice";
import Outclick from "../../hoc/Outclick";
import Card from "../common/Card";
import Col from "../layout/Col";
import Row from "../layout/Row";
import Button from "../common/Button";

function QuickCheckinCard() {
  const [isCheckAvailable, setCheckStatus] = useState(false);
  const [isCheckIn, setCheckIn] = useState(true);
  const [lastCheckTime, setLastCheckTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isNotesOpened, setOpenNotes] = useState(false);
  const userCredential = useSelector(selectUserCredential);

  const timer = useTimeCounter();
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
      let lastCheck = checkinList[0];
      if (lastCheck) {
        for (let i = 1; i < checkinList.length; i++) {
          const recordData = checkinList[i];
          const createdTimeStr = recordData.fields.CreatedDate;
          const lastCheckTimeStr = lastCheck.fields.CreatedDate;
          if (Date.parse(createdTimeStr) > Date.parse(lastCheckTimeStr)) {
            lastCheck = recordData;
          }
        }
        // the Type's index is 2 in the fieldList
        if (lastCheck.fields.Type === "Check-in") {
          setCheckIn(false);
        } else {
          setCheckIn(true);
        }
        setLastCheckTime(
          new Date(lastCheck.fields.CreatedDate).toLocaleString()
        );

        // we check at least 4 hours for creating a new check-in/out
        const lastCheckTime = Date.parse(lastCheck.fields.CreatedDate);
        if (now - lastCheckTime >= 4 * 60 * 60 * 1000) {
          setCheckStatus(true);
        }
      } else {
        setCheckStatus(true);
      }

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
    <Card
      inactive={isCheckAvailable}
      isLoading={loading}
      cardHeader={{
        title: isCheckIn ? "Check-in" : "Check-out",
        rightTitle: isCheckAvailable && (
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
            <p style={{ maxWidth: "300px" }}>
              {isCheckAvailable
                ? `Create a new check-${
                    isCheckIn ? "in" : "out"
                  } for today before working`
                : `You have processed the check recently, last check ${
                    isCheckIn ? "out" : "in"
                  }: ${lastCheckTime}`}
            </p>
          </Row>
          {isCheckAvailable && (
            <Row className="justify-content-end">
              <Button
                className="py-2 px-4"
                onClick={isCheckIn ? handleCheckIn : handleCheckOut}
              >
                {isCheckIn ? "Check-in" : "Check-out"}
              </Button>
            </Row>
          )}
        </Col>,
      ]}
    />
  );
}

const TextAreaForNotes = styled.textarea`
  padding: 5px 8px;
  &:active,
  &:focus {
    outline: none !important;
  }
`;

export default QuickCheckinCard;
