import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  retrieveRoleList,
  selectError,
  selectIsSuccess,
  selectLoading,
  selectRoleTableData,
} from "../../features/roleSlice";
import {
  retrieveStaffList,
  selectStaffTableData,
} from "../../features/staffSlice";
import { selectUserCredential } from "../../features/userSlice";
import { mapResultToTableData } from "../../services/airtable.service";
import Card from "../common/Card";
import Loader from "../common/Loader";
import Table from "../common/Table";
import Container from "../layout/Container";
import MainContent from "../layout/MainContent";
import MainHeader from "../layout/MainHeader";
import styledComponents from "styled-components";

function Role() {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const fieldListForRoleTable = useMemo(
    () => ["Name", "DatabaseAccessibility", "DepartmentName"],
    []
  );

  const isLoading = useSelector(selectLoading);
  const isSuccess = useSelector(selectIsSuccess);
  const error = useSelector(selectError);
  const staffList = useSelector(selectStaffTableData);
  const roleList = useSelector(selectRoleTableData);
  const userCredential = useSelector(selectUserCredential);

  const userStaffId = userCredential?.StaffId[0];
  const userAdminRow = staffList?.find(
    (staff) => staff.fields.StaffId === userStaffId
  );
  const userRole = userAdminRow?.fields.RoleType;
  const userPermission = useMemo(
    () => [
      {
        title: "User can access thess routes: ",
        routes: ["Admin: /admin", "Staff: /staff", "Database: /database"],
      },
      "Can add or remove the staff in Staff database",
      "Can check all table in database of Airtable in Database",
    ],
    []
  );

  const roleTable = useMemo(
    () => roleList && mapResultToTableData(roleList, fieldListForRoleTable),
    [roleList, fieldListForRoleTable]
  );

  // retrieve the data if redux store doesn't have value
  useEffect(() => {
    !staffList && dispatch(retrieveStaffList());
    !roleList && dispatch(retrieveRoleList());
    // eslint-disable-next-line
  }, []);
  // effect hook for loading table data from Airtable
  useEffect(() => {
    if (isSuccess) {
      if (error) {
        console.log(error);
        addToast("Retrieve data failed! Please check your connection...", {
          appearance: "error",
        });
      }
    }
    // eslint-disable-next-line
  }, [isSuccess, roleList, error]);

  return (
    <>
      {isLoading && <Loader />}
      <MainContent>
        <MainHeader
          title="Control your company roles"
          subTitle="Your company administrators and employee"
        />
        <Container fluid>
          <Card
            cardHeader={{
              title: "Your Role",
              extension: true,
            }}
            isLoading={userRole ? false : true}
            isHasHideCard
            elementList={[<h1 className="text-center">{userRole}</h1>]}
          />
          <Card
            cardHeader={{
              title: "Your Permission",
              extension: true,
            }}
            isHasHideCard
            elementList={[
              <ul
                className="text-left"
                style={{
                  overflow: "auto",
                }}
              >
                {userPermission.map((item, i) => {
                  if (i === 0) {
                    return (
                      <li key={i}>
                        {item.title}
                        <ul>
                          {item.routes.map((subItem, j) => (
                            <li key={j} className="text-secondary">
                              {subItem}
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  } else return <li key={i}>{item}</li>;
                })}
              </ul>,
            ]}
          />
          <Card
            cardHeader={{
              title: "Roles List",
              extension: true,
            }}
            isLoading={!roleTable}
            isHasHideCard
            noBodyPadding
            elementList={[
              roleTable && (
                <Table
                  tableName="Total Role of Company"
                  fieldList={fieldListForRoleTable}
                  recordList={roleTable}
                  isHasSettings
                  tableStyle={{ height: "282px", overflow: "auto" }}
                />
              ),
            ]}
          />
        </Container>
      </MainContent>
    </>
  );
}

export default Role;
