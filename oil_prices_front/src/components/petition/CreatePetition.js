import React from "react";
import { Row, Col, Card } from "react-bootstrap";

import GeneralForm from "../layout/GeneralForm";

const CreatePetition = ({ url }) => {
  const fields = [
    {
      label: "Number of days to simulate",
      name: "num_days",
      type: "number",
    },
    {
      label: "Paths to simulate",
      name: "num_reps",
      type: "number",
    },
    {
      label: "Trade oil market",
      name: "oil_reference",
      type: "select",
      options: [
        { name: "--", value: "" },
        { name: "BRENT", value: "BRENT" },
        { name: "WTI", value: "WTI" },
      ],
    },
    {
      label: "Simulation model",
      name: "sim_model",
      type: "select",
      options: [
        { name: "--", value: "" },
        { name: "Geometric Brownian Motion (GBM)", value: "MBG" },
        { name: "GBM with Mean Reversion", value: "MBGMR" },
      ],
    },
    {
      label: "Starting date for simulation",
      name: "date",
      type: "date",
    },
  ];

  const validateForm = (values) => {
    const err = {};
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    if (values.num_days < 1) {
      err.num_days = "Number of days to simulate must be greater than 1.";
    }
    if (values.num_reps < 1 || values.num_reps > 10000) {
      err.num_reps = "Number of paths to simulate must be between 1 and 10000.";
    }
    if (values.oil_reference === "") {
      err.oil_reference = "Please select a trade oil market";
    }
    if (values.sim_model === "") {
      err.sim_model = "Please select a simulation model";
    }
    if (today.localeCompare(values.date) < 0) {
      err.date = "Please select a valid date, no future dates allowed";
    }
    return err;
  };

  const submit = () => {};

  return (
    <Row className="justify-content-md-center">
      <Col xs="6">
        <Card>
          <Card.Body>
            <Card.Title>Singup</Card.Title>
            <GeneralForm
              fields={fields}
              validateForm={validateForm}
              apiRoute={url + "api/petitions/"}
              submit={submit}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CreatePetition;
