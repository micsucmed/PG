import React from "react";
import LineGraph from "./LineGraph";
import { Col, Card } from "react-bootstrap";
import LoadingIndicator from "../../layout/LoadingIndicator";

const Paths = ({ prices }) => {
  const renderLineGraph = () => {
    return <LineGraph data={prices}></LineGraph>;
  };

  return (
    <Col className="pl-1 pr-2">
      <Card>
        <Card.Header>Oil price for every path and day simulated</Card.Header>
        <Card.Body>
          <LoadingIndicator area="line-graph-area" />
          {renderLineGraph()}
        </Card.Body>
        <Card.Footer>
          <Card.Text>
            Each line represents a possible path in which the oil price might go
          </Card.Text>
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default Paths;
