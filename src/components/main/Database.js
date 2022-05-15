import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserCredential } from "../../features/userSlice";
import Card from "../common/Card";
import Loader from "../common/Loader";
import Container from "../layout/Container";
import MainContent from "../layout/MainContent";
import MainHeader from "../layout/MainHeader";
import AirtableView from "../specific/AirtableView";
import { Responsive } from "react-grid-layout";
import WidthContainer from "../../hoc/WidthContainer";
import styledComponents from "styled-components";

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

  // used for grid layout initial placement
  const [layouts, setLayouts] = useState({
    xxs: [
      { i: "0", x: 0, y: 0, w: 1, h: 4 },
      { i: "1", x: 0, y: 4, w: 1, h: 4 },
      { i: "2", x: 0, y: 8, w: 1, h: 4 },
      { i: "3", x: 0, y: 12, w: 1, h: 4 },
      { i: "4", x: 0, y: 16, w: 1, h: 4 },
      { i: "5", x: 0, y: 20, w: 1, h: 4 },
      { i: "6", x: 0, y: 24, w: 1, h: 4 },
      { i: "7", x: 0, y: 28, w: 1, h: 4 },
    ],
  });
  // list of GridItem
  const listCard = useMemo(
    () => [
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
      />,
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
      />,
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
      />,
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
      />,
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
      />,
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
      />,
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
      />,
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
      />,
    ],
    [isForcedLoading]
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

  return (
    <>
      {!userCredential && <Loader />}
      <MainContent>
        <MainHeader
          title="Airtable Data View"
          subTitle="Your company database..."
        />
        <Container fluid>
          <WidthContainer>
            <Responsive
              className="layout"
              isResizable={false}
              isDraggable={false}
              containerPadding={{
                xxs: [0, 0],
              }}
              margin={{ xxs: [0, 20] }}
              layouts={layouts}
              breakpoints={{ xxs: 0 }}
              cols={{ xxs: 1 }}
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

export default Database;
