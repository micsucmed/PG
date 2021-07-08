import React from "react";
import axios from "axios";
import {
  Card,
  ListGroup,
  ListGroupItem,
  Button,
  Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const Petition = ({ simulation, url }) => {
  const deleteSimulation = async () => {
    await axios.delete(`${url}api/petitions/detail/${simulation.id}/`, {
      headers: {
        Authorization: `token ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    window.location.reload();
  };

  const renderButton = () => {
    if (simulation.processed === true) {
      return (
        <Card.Body className="text-center">
          <Link
            to={{
              pathname: `/petitions/detail/${simulation.id}/`,
              state: { petitionId: simulation.id },
            }}
            style={{ textDecoration: "none", color: "white" }}
          >
            <Button className="btn-info">See dashboard</Button>
          </Link>
          <Button className="btn-danger ml-4" onClick={deleteSimulation}>
            Delete
          </Button>
        </Card.Body>
      );
    } else {
      return (
        <Card.Body className="text-center">
          <Button className="btn-info" disabled>
            See dashboard
          </Button>
          <Button className="btn-danger ml-4" disabled>
            Delete
          </Button>
          <Card.Text className="text-muted">
            Simulation dashboard will be available when simulation is finished
          </Card.Text>
        </Card.Body>
      );
    }
  };

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
        {renderButton()}
      </Card>
    </Container>
  );
};

export default Petition;
