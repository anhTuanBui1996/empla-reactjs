import React from "react";
import { MdDisabledVisible } from "react-icons/md";
import Col from "../layout/Col";
import Container from "../layout/Container";
import MainContent from "../layout/MainContent";
import Row from "../layout/Row";

function Nomatch() {
  return (
    <MainContent>
      <Container fluid>
        <Row>
          <Col
            columnSize={["12"]}
            className="text-center d-flex justify-content-center align-items-center"
            style={{ height: "100vh", fontSize: "20px" }}
          >
            <MdDisabledVisible size={30} className="mr-3" />
            There is nothing here...
          </Col>
        </Row>
      </Container>
    </MainContent>
  );
}

export default Nomatch;
