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
import { Responsive } from "react-grid-layout";
import styledComponents from "styled-components";
import WidthContainer from "../../hoc/WidthContainer";

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

  // used for grid layout initial placement
  const [layouts, setLayouts] = useState({
    lg: [
      { i: "0", x: 0, y: 0, w: 1, h: 1 },
      { i: "1", x: 0, y: 1, w: 1, h: 1.6 },
      { i: "2", x: 1, y: 0, w: 1, h: 2.58 },
    ],
    md: [
      { i: "0", x: 0, y: 0, w: 1, h: 1 },
      { i: "1", x: 0, y: 1, w: 1, h: 1.64 },
      { i: "2", x: 0, y: 2.64, w: 1, h: 2.7 },
    ],
    xs: [
      { i: "0", x: 0, y: 0, w: 1, h: 1 },
      { i: "1", x: 0, y: 1, w: 1, h: 1.76 },
      { i: "2", x: 0, y: 2.76, w: 1, h: 2.5 },
    ],
    xxs: [
      { i: "0", x: 0, y: 0, w: 1, h: 1 },
      { i: "1", x: 0, y: 1, w: 1, h: 1.9 },
      { i: "2", x: 0, y: 2.9, w: 1, h: 2.8 },
    ],
  });
  // list of GridItem
  const listCard = useMemo(
    () => [
      <Card
        cardHeader={{
          title: "Your Role",
          extension: true,
        }}
        isLoading={userRole ? false : true}
        isHasHideCard
        elementList={[<h1 className="text-center">{userRole}</h1>]}
      />,
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
      />,
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
      />,
    ],
    [userRole, roleTable, fieldListForRoleTable, userPermission]
  );
  // list of Card for displaying
  const [cardAvailable, setCardAvailable] = useState(
    listCard.map(() => ({
      isDisplayed: true,
    }))
  );

  // remove a GridItem
  const removeGridItem = (keyIndex) => {
    setCardAvailable((state) => [
      ...state.slice(0, keyIndex),
      {
        ...state[keyIndex],
        isDisplayed: false,
      },
      ...state.slice(keyIndex + 1),
    ]);
    setLayouts((state) => ({
      lg: [...state.lg.slice(0, keyIndex), ...state.lg.slice(keyIndex + 1)],
      xxs: [...state.xxs.slice(0, keyIndex), ...state.xxs.slice(keyIndex + 1)],
    }));
  };

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
          title="Database Access Roles"
          subTitle="Your company administrators"
        />
        <Container fluid>
          <WidthContainer>
            <Responsive
              className="layout"
              isResizable={false}
              isDraggable={false}
              containerPadding={{
                lg: [0, 0],
                md: [0, 0],
                xs: [0, 0],
                xxs: [0, 0],
              }}
              margin={{ lg: [20, 20], md: [0, 20], xs: [0, 20], xxs: [0, 20] }}
              layouts={layouts}
              breakpoints={{ lg: 700, md: 456, xs: 396, xxs: 0 }}
              cols={{ lg: 2, md: 1, xs: 1, xxs: 1 }}
              rowHeight={150}
              width={0}
            >
              {listCard.map((card, index) => {
                if (!cardAvailable[index].isDisplayed) return null;
                return (
                  <GridItem key={index.toString()}>
                    {React.cloneElement(card, {
                      onHideCard: () => removeGridItem(index),
                    })}
                  </GridItem>
                );
              })}
            </Responsive>
          </WidthContainer>
        </Container>
      </MainContent>
    </>
  );
}

const GridItem = styledComponents.article`
  position: relative;
`;

export default Admin;
