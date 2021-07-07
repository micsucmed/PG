import React from "react";
import { Tab, Nav, Row, Col } from "react-bootstrap";
import Paths from "./line-graph/Paths";
import Days from "./histogram/Days";
import ConInt from "./trend-chart/ConInt";

const Graphs = ({ prices, ci }) => {
  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="line-graph">
      <Row className="py-3">
        <Col md={4} className="pr-0 pl-4">
          <Nav variant="pills" className="flex-column pr-4 pr-md-0">
            <Nav.Item>
              <Nav.Link eventKey="line-graph">Line Graph</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="histogram">Histogram</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="trend-chart">Trend Chart</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={8}>
          <Tab.Content>
            <Tab.Pane eventKey="line-graph">
              <Paths prices={prices} />
            </Tab.Pane>
            <Tab.Pane eventKey="histogram">
              <Days prices={prices} />
            </Tab.Pane>
            <Tab.Pane eventKey="trend-chart">
              <ConInt ci={ci} />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default Graphs;
