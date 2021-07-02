import React from "react";
import { Container, Card, CardGroup } from "react-bootstrap";

const Parameters = ({ simulation }) => {
  const renderParameters = () => {
    let header = "";
    const parameters = Object.entries(simulation);
    return parameters.map((p, i) => {
      switch (p[0]) {
        case "oil_reference":
          header = "Oil Reference";
          break;
        case "num_days":
          header = "Days simulated";
          break;
        case "num_reps":
          header = "Paths simulated";
          break;
        case "date":
          header = "Starting date";
          break;
        case "sim_model":
          header = "Model";
          break;
        case "owner":
          return false;
        case "processed":
          return false;
        default:
          header = "Simulation #";
          break;
      }
      return (
        <Container className="col-6 col-md-4 col-xl-2 p-2" key={`param${i}`}>
          <Card>
            <Card.Header>{header}</Card.Header>
            <Card.Body>
              <Card.Title>{p[1]}</Card.Title>
            </Card.Body>
          </Card>
        </Container>
      );
    });
  };

  return <CardGroup>{renderParameters()}</CardGroup>;
};

export default Parameters;
