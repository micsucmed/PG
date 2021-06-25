import React from "react";
import {
  Card,
  ListGroup,
  ListGroupItem,
  Button,
  Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const Petition = ({ simulation }) => {
  return (
    <Container className="col-6 col-lg-4 col-xl-3 px-0 py-4">
      <Card>
        <Card.Header as="h5">
          {"Simulation #" +
            simulation.id +
            " for reference: " +
            simulation.oil_reference}
        </Card.Header>
        <ListGroup className="list-group-flush">
          <ListGroupItem>
            {"Days simulated: " + simulation.num_days}
          </ListGroupItem>
          <ListGroupItem>
            {"Paths simulated: " + simulation.num_reps}
          </ListGroupItem>
          <ListGroupItem>
            {"Simulation starting day: " + simulation.date}
          </ListGroupItem>
          <ListGroupItem>
            {"Simulation model: " + simulation.sim_model}
          </ListGroupItem>
        </ListGroup>
        <Card.Body className="text-center">
          <Button className="btn-info">
            <Link
              to={{
                pathname: `/petitions/detail/${simulation.id}/`,
                state: { petitionId: simulation.id },
              }}
              style={{ textDecoration: "none", color: "white" }}
            >
              See dashboard
            </Link>
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Petition;
