import React from "react";
import GeneralForm from "../layout/GeneralForm";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = ({ url, logged }) => {
  const fields = [
    {
      label: "Email",
      name: "username",
      type: "email",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
    },
  ];

  const validateForm = (values) => {
    const err = {};
    return err;
  };

  const submit = (response) => {
    localStorage.setItem("token", JSON.stringify(response.data["token"]));
    logged();
  };

  return (
    <section id="login" className="pt-5">
      <Row className="justify-content-md-center">
        <Col xs="6">
          <Card>
            <Card.Body>
              <Card.Title>Login</Card.Title>
              <GeneralForm
                fields={fields}
                validateForm={validateForm}
                apiRoute={url + "api/accounts/login/"}
                submit={submit}
              />
              <div className="text-center">
                <Card.Text>Don't have an account?</Card.Text>
                <Link to="/signup">
                  <Button variant="link">Signup</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default Login;
