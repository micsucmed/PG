import React, { useState } from "react";
import Histogram from "./Histogram";
import { Container, Row, Col, Card } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import LoadingIndicator from "../../layout/LoadingIndicator";

const Days = ({ prices }) => {
  const [value, setValue] = useState(1);
  const [day, setDay] = useState(1);
  const [p, setP] = useState(1);

  const renderHistogram = () => {
    return <Histogram data={prices[day]} p={p}></Histogram>;
  };

  return (
    <Col className="pl-1 pr-2">
      <Card>
        <Card.Header>Oil price histogram for choosen day</Card.Header>
        <Card.Body>
          <LoadingIndicator area="line-graph-area" />
          {renderHistogram()}
        </Card.Body>
        <Card.Footer>
          <Row>
            <Col className="border-right">
              <Container className="mb-4">
                <Card.Text className="mb-0">Significance level:</Card.Text>
                <RangeSlider
                  value={p}
                  onChange={(changeEvent) => setP(changeEvent.target.value)}
                  min={0}
                  max={1}
                  step={0.01}
                  tooltip="on"
                />
              </Container>
            </Col>
            <Col>
              <Container className="pb-4">
                <Card.Text className="mb-0">Day:</Card.Text>
                <RangeSlider
                  value={value}
                  onChange={(changeEvent) => setValue(changeEvent.target.value)}
                  onAfterChange={(changeEvent) =>
                    setDay(changeEvent.target.value)
                  }
                  min={1}
                  max={prices.length - 1}
                  tooltip="on"
                />
              </Container>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default Days;
