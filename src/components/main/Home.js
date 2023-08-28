import React from "react";
import { useSelector } from "react-redux";
import { selectLoading } from "../../features/tables/checkinSlice";
import { selectUserInfo } from "../../features/userSlice";
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
  const userInfo = useSelector(selectUserInfo);
  const checkInLoading = useSelector(selectLoading);
  return (
    <>
      {(!userInfo || checkInLoading) && <Loader />}
      <MainContent>
        <MainHeader title="Dashboard" subTitle="Console of your work" />
        <Container fluid>
          <h1 className="greeting-title d-flex pb-3" style={{ gap: "10px" }}>
            Hello, {userInfo?.fields.FullName} ({userInfo?.fields.Username})
            <span
              className={"badge font-weight-bold ml-2 badge-primary"}
              style={{
                fontSize: "0.5em",
                width: "fit-content",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {userInfo?.fields.RoleType[0]}
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
