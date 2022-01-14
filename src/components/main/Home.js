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
          <h1 className="greeting-title">
            Hello, {userCredential?.FullName} ({userCredential?.Username})
          </h1>
          <Row>
            <Col columnSize={["auto"]}>
              <QuickCheckinCard />
            </Col>
          </Row>
        </Container>
      </MainContent>
    </>
  );
}

export default Home;
