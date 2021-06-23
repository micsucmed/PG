import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Container, CardDeck } from "react-bootstrap";
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
    <Container>
      <h1 className="text-center">Your Simulations</h1>
      {renderSimulations()}
    </Container>
  );
};

export default Petitions;
