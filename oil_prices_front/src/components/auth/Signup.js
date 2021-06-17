import React from "react";
import { Row, Col, Card } from "react-bootstrap";

import GeneralForm from "../layout/GeneralForm";

const Signup = ({ url }) => {
  const fields = [
    {
      label: "email",
      type: "email",
      muted: "Your information will not be shared with anyone.",
    },
    {
      label: "username",
      type: "text",
    },
    {
      label: "password",
      type: "password",
    },
    {
      label: "confirm password",
      type: "password",
    },
  ];

  const validateForm = (values) => {
    const err = {};
    const rejectPassword = new RegExp(
      /^^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    );
    if (values.email.length === 0) {
      err.email = "You must provide an email";
    }
    if (!rejectPassword.test(values.password)) {
      err.password =
        "Password must have at least 8 characters including upper and lowercase letters and a number(s)";
    }
    if (values.password.length === 0) {
      err.password = "Password can't be empty";
    }
    if (values.password !== values["confirm password"]) {
      err["confirm password"] = "Passwords must match";
    }
    return err;
  };

  return (
    <Row className="justify-content-md-center">
      <Col xs="6">
        <Card>
          <Card.Body>
            <Card.Title>Singup</Card.Title>
            <GeneralForm
              fields={fields}
              validateForm={validateForm}
              apiRoute={url + "api/accounts/register/"}
              strength={true}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Signup;
