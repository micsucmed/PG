import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import Paths from "./Paths";
import Parameters from "./Parameters";
import Days from "./Days";

const Simulation = ({ url }) => {
  const simDummy = {
    id: "Loading...",
    owner: "Loading...",
    num_days: "Loading...",
    num_reps: "Loading...",
    oil_reference: "Loading...",
    date: "Loading...",
    sim_model: "Loading...",
  };

  const priceDummy = [
    [0, 0],
    [0, 0],
  ];

  const { id } = useParams();
  const [simulation, setSimulation] = useState(simDummy);
  const [prices, setPrices] = useState(priceDummy);

  const fetchSimulation = useCallback(async () => {
    const resultSimulation = await axios.get(
      url + `api/petitions/detail/${id}/`,
      {
        headers: {
          Authorization: `token ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );
    setSimulation(resultSimulation.data);
  }, [url, id]);

  const fetchPrices = useCallback(() => {
    trackPromise(
      axios
        .get(url + `api/petitions/detail/${id}/prices/`, {
          headers: {
            Authorization: `token ${JSON.parse(localStorage.getItem("token"))}`,
          },
        })
        .then((response) => {
          setPrices(response.data.prices);
        })
        .catch((err) => {
          console.log(err);
        }),
      "line-graph-area"
    );
  }, [url, id]);

  useEffect(() => {
    fetchSimulation();
    fetchPrices();
  }, [fetchSimulation, fetchPrices]);

  return (
    <Container fluid>
      <Container fluid>
        <Parameters simulation={simulation} />
        <Row>
          <Paths prices={prices} />
          <Days prices={prices} />
        </Row>
      </Container>
    </Container>
  );
};

export default Simulation;
