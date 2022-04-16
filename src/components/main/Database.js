import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserCredential } from "../../features/userSlice";
import Card from "../common/Card";
import Loader from "../common/Loader";
import Container from "../layout/Container";
import MainContent from "../layout/MainContent";
import MainHeader from "../layout/MainHeader";
import AirtableView from "../specific/AirtableView";

function Database() {
  const userCredential = useSelector(selectUserCredential);
  const [isForcedLoading, setForceLoadingState] = useState(false);
  const handleChangeFrame = () => {
    setForceLoadingState(true);
  };
  const handleStopForceLoading = () => {
    setForceLoadingState(false);
  };
  return (
    <>
      {!userCredential && <Loader />}
      <MainContent>
        <MainHeader
          title="Airtable Data View"
          subTitle="Your company database..."
        />
        <Container fluid>
          <Card
            cardHeader={{
              title: "All Staff Info",
              extension: true,
              navList: ["Staff", "Status", "Account"],
              badge: {
                label: "Admin",
                theme: "danger",
              },
            }}
            isHasHideCard
            elementList={[
              <AirtableView
                shareId="shrVZ5SjFnllKJrmm"
                isForceLoading={isForcedLoading}
                stopLoadingHandler={handleStopForceLoading}
              />,
              <AirtableView
                shareId="shr3O9WkKPYWCweX8"
                isForceLoading={isForcedLoading}
                stopLoadingHandler={handleStopForceLoading}
              />,
              <AirtableView
                shareId="shrSsyXZL86WAoJGZ"
                isForceLoading={isForcedLoading}
                stopLoadingHandler={handleStopForceLoading}
              />,
            ]}
            onChangeTab={handleChangeFrame}
          />
          <Card
            cardHeader={{
              title: "Total Staff Check-in",
              extension: true,
              badge: {
                label: "Admin",
                theme: "danger",
              },
            }}
            isHasHideCard
            elementList={[<AirtableView shareId="shroWMNVQkI3WO183" />]}
          />
          <Card
            cardHeader={{
              title: "Company Role List",
              extension: true,
              badge: {
                label: "Admin",
                theme: "danger",
              },
            }}
            isHasHideCard
            elementList={[<AirtableView shareId="shrzceWEiXGB9pQ6b" />]}
          />
          <Card
            cardHeader={{
              title: "Departments",
              extension: true,
              badge: {
                label: "Admin",
                theme: "danger",
              },
            }}
            isHasHideCard
            elementList={[<AirtableView shareId="shrybOeBD2FnVST2N" />]}
          />
          <Card
            cardHeader={{
              title: "Working Places / Offices",
              extension: true,
              badge: {
                label: "Admin",
                theme: "danger",
              },
            }}
            isHasHideCard
            elementList={[<AirtableView shareId="shrLBEwqIxxF23LTb" />]}
          />
          <Card
            cardHeader={{
              title: "Collaborations",
              extension: true,
              badge: {
                label: "Admin",
                theme: "danger",
              },
            }}
            isHasHideCard
            elementList={[<AirtableView shareId="shrYDTGt2SnJYylrg" />]}
          />
        </Container>
      </MainContent>
    </>
  );
}

export default Database;
