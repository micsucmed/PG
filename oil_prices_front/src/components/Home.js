import React from "react";
import { Container } from "react-bootstrap";

function Home() {
  return (
    <Container fluid className="px-0">
      <Container fluid className="px-0 banner">
        <h1 className="large-text align-middle"> WELCOME TO OIL PRICES</h1>
      </Container>
      <Container className="pt-5 px-5">
        <Container className="px-5">
          <h2 className="intro-title">What can you do here?</h2>
          <hr />
          <h3 className="intro">
            Estimate oil prices for BRENT and WTI markets using stocastic
            methods: Geometric Brownian Motion and Geometric Brownian Motion
            with Mean Reversion .
          </h3>
        </Container>
      </Container>
    </Container>
  );
}

export default Home;
