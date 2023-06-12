import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { selectMetadata } from "../../features/metadataSlice";
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

function Role() {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const fieldListForRoleTable = useMemo(
    () => [
      "RoleName",
      "DatabaseAccessibility",
      "DepartmentName",
      "Description",
    ],
    []
  );

  const isLoading = useSelector(selectLoading);
  const isSuccess = useSelector(selectIsSuccess);
  const error = useSelector(selectError);
  const staffList = useSelector(selectStaffTableData);
  const roleList = useSelector(selectRoleTableData);
  const userCredential = useSelector(selectUserCredential);

  const [isModalDisplay, setModalDisplay] = useState(false);
  const [modalType, setModalType] = useState("create");

  const userStaffId = userCredential?.StaffId[0];
  const userRole = staffList?.find(
    (staff) => staff.fields.StaffId === userStaffId
  );
  const userRoleType = userRole?.fields.RoleType;
  const userPermission = userRole?.fields.Description;

  const baseMetadata = useSelector(selectMetadata);
  const tableMetadata = baseMetadata.tables.find(
    (table) => table.name === "Role"
  );

  const roleTable = useMemo(
    () =>
      roleList &&
      mapResultToTableData(
        roleList,
        "Role",
        fieldListForRoleTable,
        tableMetadata
      ),
    [roleList, fieldListForRoleTable, tableMetadata]
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
            elementList={[<h1 className="text-center">{userRoleType}</h1>]}
          />
          <Card
            cardHeader={{
              title: "Your Permission",
              extension: true,
            }}
            isHasHideCard
            elementList={[userPermission]}
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
