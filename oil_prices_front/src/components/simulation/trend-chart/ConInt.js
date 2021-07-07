import React from "react";
import { Col, Card } from "react-bootstrap";
import LoadingIndicator from "../../layout/LoadingIndicator";
import TrendChart from "./TrendChart";

const ConInt = ({ ci }) => {
  const renderTrendChart = () => {
    return <TrendChart data={ci}></TrendChart>;
  };

  return (
    <Col className="pl-1 pr-2">
      <Card>
        <Card.Header>Oil price trends</Card.Header>
        <Card.Body>
          <LoadingIndicator area="line-graph-area" />
          {renderTrendChart()}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ConInt;
