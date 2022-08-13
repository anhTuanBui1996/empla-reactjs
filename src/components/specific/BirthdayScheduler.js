import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

function BirthdayScheduler({ events }) {
  // we import all data from Status table then mapping
  const birthdayList = useMemo(() => {
    return events?.map((record) => {
      return {
        birthday: record.fields.BirthdayCelebration,
        fullName: record.fields.FullName[0],
        username: record.fields.Username[0],
        staffId: record.fields.StaffId[0],
      };
    });
  }, [events]);
  const now = new Date();
  const currentWeekday = now.getDay();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const weekday = useMemo(() => {
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  }, []);
  const monthList = useMemo(() => {
    return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  }, []);
  const [dateArr, setDateArr] = useState(fillDateForWeek(now));
  const [showDetail, setShowDetail] = useState(false);

  /* eslint-disable */
  useEffect(() => {
    if (birthdayList) {
      birthdayList.forEach((itemBirthdate) => {
        const newBirthday = new Date(itemBirthdate.birthday);
        if (newBirthday.getMonth() === currentMonth) {
          const findInDateArr = dateArr.findIndex(
            (itemDate) => itemDate.date === newBirthday.getDate()
          );
          if (findInDateArr !== -1) {
            setDateArr((state) => {
              const newState = state;
              newState[findInDateArr].event.push(itemBirthdate);
              newState[findInDateArr].count++;
              return newState;
            });
          }
        }
      });
    }
  }, [birthdayList]);

  return (
    <SchedulerContainer className="custom-scheduler">
      <h3 className="month-title text-center font-weight-bold">
        {`${monthList[currentMonth]} ${currentDay}, ${currentYear}`}
      </h3>
      <table className="calendar-scheduler w-100" style={{ marginTop: "23.5px" }}>
        <thead className="border border-0">
          <tr className="weekday-title border border-0">
            {weekday.map((item, index) => {
              if (currentWeekday === 0 && index === 6) {
                return (
                  <th key={index} className="text-center bg-primary text-light">
                    {item}
                  </th>
                );
              } else if (index === currentWeekday - 1) {
                return (
                  <th key={index} className="text-center bg-primary text-light">
                    {item}
                  </th>
                );
              } else {
                return (
                  <th key={index} className="text-center bg-light">
                    {item}
                  </th>
                );
              }
            })}
          </tr>
        </thead>
        <tbody>
          <tr className="events-row">
            {dateArr &&
              dateArr.map((item, index) => (
                <CellDay
                  key={index}
                  className="text-center px-1 position-relative border border-1"
                >
                  <span
                    className="date-title position-absolute text-secondary"
                    style={{ top: "5px", right: "5px" }}
                  >
                    {item.date}
                  </span>
                  {item.event.length > 0 && (
                    <div
                      className="dropdown"
                      onMouseLeave={() => setShowDetail(false)}
                    >
                      <CellEvent
                        className="bg-secondary text-light rounded"
                        event={item.event}
                        onMouseEnter={() => setShowDetail(true)}
                      >
                        {item.count > 0 && item.count}
                      </CellEvent>
                      <div
                        className={`dropdown-menu px-3 bg-info dropdown-menu-${
                          index >= 3 ? "right" : "left"
                        }${showDetail ? " d-block" : ""}`}
                        style={{ width: "200px", color: "#fff" }}
                      >
                        {item.event.map((staff) => (
                          <div
                            key={staff.staffId}
                          >{`${staff.fullName} (${staff.username})`}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </CellDay>
              ))}
          </tr>
        </tbody>
      </table>
    </SchedulerContainer>
  );
}

Scheduler.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
};

const SchedulerContainer = styled.div`
  table {
    border-collapse: separate;
    border: 0;
    border-spacing: 0;
    box-shadow: 0 2px 6px -2px darkgrey;
  }
  th {
    border: solid #afdaff 1px;
  }
  th:first-child {
    border-top-left-radius: 5px;
  }
  th:last-child {
    border-top-right-radius: 5px;
  }
  tbody tr:last-child td:first-child {
    border-bottom-left-radius: 5px;
  }
  tbody tr:last-child td:last-child {
    border-bottom-right-radius: 5px;
  }
`;
const CellDay = styled.td`
  height: 100px;
  width: 100px;
`;
const CellEvent = styled.div`
  max-width: 100px;
  cursor: pointer;
`;

const fillDateForWeek = (current) => {
  const currentWeekday = current.getDay();
  const currentDay = currentWeekday === 0 ? 6 : currentWeekday - 1;
  let dateArray = [];
  for (let i = 0; i <= currentDay; i++) {
    const newDate = new Date(current.getTime() - i * 24 * 3600000);
    dateArray.unshift({ date: newDate.getDate(), count: 0, event: [] });
  }
  for (let i = 1; i < 7 - currentDay; i++) {
    const newDate = new Date(current.getTime() + i * 24 * 3600000);
    dateArray.push({ date: newDate.getDate(), count: 0, event: [] });
  }
  return dateArray;
};

export default BirthdayScheduler;
