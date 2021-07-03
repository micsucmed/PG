import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";

function Home() {
  return (
    <Container fluid className="px-0">
      <Row>
        <Col className="col-5">
          <h1>WELCOME TO OIL PRICES</h1>
        </Col>
        <Col className="col-7 pl-0 mh-100">
          <Image src="https://wallpapercave.com/wp/wp2128235.png" />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
