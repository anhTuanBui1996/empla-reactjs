import React from "react";
import { useSelector } from "react-redux";
import { selectLoading } from "../../features/checkinSlice";
import { selectUserCredential } from "../../features/userSlice";
import Loader from "../common/Loader";
import useTimeCounter from "../hooks/useTimeCounter";
import Col from "../layout/Col";
import Container from "../layout/Container";
import MainContent from "../layout/MainContent";
import MainHeader from "../layout/MainHeader";
import Row from "../layout/Row";
import QuickCheckinCard from "../specific/QuickCheckinCard";

function Home() {
  // start the time counter
  useTimeCounter();
  const userCredential = useSelector(selectUserCredential);
  const checkInLoading = useSelector(selectLoading);
  return (
    <>
      {(!userCredential || checkInLoading) && <Loader />}
      <MainContent>
        <MainHeader title="Dashboard" subTitle="Console of your work" />
        <Container fluid>
          <h1
            className="greeting-title d-flex pb-3"
            style={{ gap: "10px" }}
          >
            Hello, {userCredential?.FullName} ({userCredential?.Username})
            <span
              className={"badge font-weight-bold ml-2 badge-primary"}
              style={{
                lineHeight: 1.5,
                fontSize: "0.5em",
                width: "fit-content",
              }}
            >
              {userCredential?.RoleType[0]}
            </span>
          </h1>
          <Row>
            <Col columnSize={["lg-6", "12"]}>
              <QuickCheckinCard />
            </Col>
          </Row>
        </Container>
      </MainContent>
    </>
  );
}

export default Home;
