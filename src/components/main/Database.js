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
  const [isForcedLoading, setForceLoadingState] = useState([false, false]);
  const handleChangeFrame = (index) => {
    setForceLoadingState((state) => {
      let newState = [...state];
      newState[index] = true;
      return newState;
    });
  };
  const handleStopForceLoading = (index) => {
    setForceLoadingState((state) => {
      let newState = [...state];
      newState[index] = false;
      return newState;
    });
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
                isForceLoading={isForcedLoading[0]}
                stopLoadingHandler={() => handleStopForceLoading(0)}
              />,
              <AirtableView
                shareId="shr3O9WkKPYWCweX8"
                isForceLoading={isForcedLoading[0]}
                stopLoadingHandler={() => handleStopForceLoading(0)}
              />,
              <AirtableView
                shareId="shrSsyXZL86WAoJGZ"
                isForceLoading={isForcedLoading[0]}
                stopLoadingHandler={() => handleStopForceLoading(0)}
              />,
            ]}
            onChangeTab={() => handleChangeFrame(0)}
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
          <Card
            cardHeader={{
              title: "Working Progress",
              extension: true,
              navList: ["Clients", "Projects", "Teams"],
              badge: {
                label: "Admin",
                theme: "danger",
              },
            }}
            isHasHideCard
            elementList={[
              <AirtableView
                shareId="shrcjn7msJzpJpcsH"
                isForceLoading={isForcedLoading[1]}
                stopLoadingHandler={() => handleStopForceLoading(1)}
              />,
              <AirtableView
                shareId="shraZJdR30hOxxuVW"
                isForceLoading={isForcedLoading[1]}
                stopLoadingHandler={() => handleStopForceLoading(1)}
              />,
              <AirtableView
                shareId="shrbvlvG6XM7SfqJO"
                isForceLoading={isForcedLoading[1]}
                stopLoadingHandler={() => handleStopForceLoading(1)}
              />,
            ]}
            onChangeTab={() => handleChangeFrame(1)}
          />
          <Card
            cardHeader={{
              title: "Logs",
              extension: true,
              badge: {
                label: "Admin",
                theme: "danger",
              },
            }}
            isHasHideCard
            elementList={[<AirtableView shareId="shrQpSQoFcncinYRz" />]}
          />
        </Container>
      </MainContent>
    </>
  );
}

export default Database;
