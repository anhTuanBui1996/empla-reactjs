import React from "react";
import { useSelector } from "react-redux";
import { selectUserCredential } from "../../features/userSlice";
import Loader from "../common/Loader";
import Col from "../layout/Col";
import Container from "../layout/Container";
import MainContent from "../layout/MainContent";
import MainHeader from "../layout/MainHeader";
import Row from "../layout/Row";
import QuickCheckinCard from "../specific/QuickCheckinCard";

function Home() {
  const userCredential = useSelector(selectUserCredential);
  return (
    <>
      {!userCredential && <Loader />}
      <MainContent>
        <MainHeader title="Dashboard" subTitle="Console of your work" />
        <Container fluid>
          <h1>
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
