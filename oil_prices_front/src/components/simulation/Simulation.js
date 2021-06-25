import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Container, Row, Col, Card, CardGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import LineGraph from "./LineGraph";
import LoadingIndicator from "../layout/LoadingIndicator";

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

  const { id } = useParams();
  const [simulation, setSimulation] = useState(simDummy);
  const [prices, setPrices] = useState([]);

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
          setPrices(response.data[0].prices);
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

  const renderLineGraph = () => {
    if (prices !== []) {
      return <LineGraph data={prices}></LineGraph>;
    } else {
      return <h5>Loading...</h5>;
    }
  };

  const renderParameters = () => {
    let header = "";
    const parameters = Object.entries(simulation);
    return parameters.map((p) => {
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
        default:
          header = "Simulation #";
          break;
      }
      return (
        <Container className="col-6 col-md-4 col-xl-2 p-2">
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

  return (
    <Container fluid>
      <Container fluid>
        <CardGroup>{renderParameters()}</CardGroup>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                Oil price for every path and day simulated
              </Card.Header>
              <Card.Body>
                <LoadingIndicator area="line-graph-area" />
                {renderLineGraph()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Simulation;
