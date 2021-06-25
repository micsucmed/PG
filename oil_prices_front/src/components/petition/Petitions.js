import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, CardDeck, Button } from "react-bootstrap";
import Petition from "./Petition";

const Petitions = ({ url }) => {
  const simDummy = [
    {
      id: "Loading...",
      owner: "Loading...",
      num_days: "Loading...",
      num_reps: "Loading...",
      oil_reference: "Loading...",
      date: "Loading...",
      sim_model: "Loading...",
    },
  ];

  const [simulations, setSimulations] = useState(simDummy);

  const fetchData = useCallback(async () => {
    const result = await axios.get(url + "api/petitions/", {
      headers: {
        Authorization: `token ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    setSimulations(result.data);
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderSimulations = () => {
    return (
      <CardDeck>
        {simulations.map((simulation, i) => {
          return <Petition key={i} simulation={simulation} />;
        })}
      </CardDeck>
    );
  };

  return (
    <Container fluid>
      <Container>
        <h1 className="text-center">Your Simulations</h1>
      </Container>
      {renderSimulations()}
      <Container fluid className="text-center pt-5">
        <Button className="btn-success">
          <Link style={{ textDecoration: "none", color: "white" }} to="/signup">
            Create Simulation
          </Link>
        </Button>
      </Container>
    </Container>
  );
};

export default Petitions;
