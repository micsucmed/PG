import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import { Alert, Container, Row } from "react-bootstrap";

const LoadingIndicator = (props) => {
  const { promiseInProgress } = usePromiseTracker({ area: props.area });
  return (
    promiseInProgress && (
      <Container className="text-center">
        <Row className="justify-content-center">
          <Alert variant="info">
            This might take a couple of minutes, loading simulation data from
            our servers!
          </Alert>
        </Row>
        <Row className="justify-content-center">
          <Loader type="ThreeDots" color="#256EFF" height="100" width="100" />
        </Row>
      </Container>
    )
  );
};

export default LoadingIndicator;
