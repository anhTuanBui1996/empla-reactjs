import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  retriveRoleList,
  selectError,
  selectIsSuccess,
  selectLoading,
  selectRoleTableData,
} from "../../features/roleSlice";
import {
  retriveStaffList,
  selectStaffTableData,
} from "../../features/staffSlice";
import { selectUserCredential } from "../../features/userSlice";
import { mapResultToTableData } from "../../services/airtable.service";
import Card from "../common/Card";
import Loader from "../common/Loader";
import Table from "../common/Table";
import Container from "../layout/Container";
import GridAnimated from "../layout/GridAnimated";
import MainContent from "../layout/MainContent";
import MainHeader from "../layout/MainHeader";

function Admin() {
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
  const userRole = staffList?.find(
    (staff) => staff.fields.StaffId === userStaffId
  ).fields.RoleType;
  const roleTable = useMemo(
    () => roleList && mapResultToTableData(roleList, fieldListForRoleTable),
    [roleList, fieldListForRoleTable]
  );

  useEffect(() => {
    !staffList && dispatch(retriveStaffList());
    !roleList && dispatch(retriveRoleList());
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (isSuccess) {
      if (error) {
        console.log(error, error);
        addToast("Retrive data failed! Please check your connection...", {
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
          title="Administrator List"
          subTitle="Your company administrators"
        />
        <Container fluid>
          <GridAnimated
            flexProps={{
              wrap: "wrap",
              direction: "column",
              justifyContent: "space-between",
            }}
          >
            <Card
              cardHeader={{
                title: "Your Role",
                extension: true,
              }}
              isHasHideCard
              elementList={[<h1 className="text-center">{userRole}</h1>]}
            />
            <Card
              cardHeader={{
                title: "Administrator List",
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
                    recordPerPage={8}
                  />
                ),
              ]}
            />
          </GridAnimated>
        </Container>
      </MainContent>
    </>
  );
}

export default Admin;
