import React from "react";
import Container from "../layout/Container";
import MainContent from "../layout/MainContent";
import MainHeader from "../layout/MainHeader";

function Admin() {
  return (
    <MainContent>
      <MainHeader
        title="Administrator List"
        subTitle="Your company administrators"
      />
      <Container fluid></Container>
    </MainContent>
  );
}

export default Admin;
