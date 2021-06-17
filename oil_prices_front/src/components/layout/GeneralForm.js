import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Toast } from "react-bootstrap";
import _ from "lodash";
import axios from "axios";
import PasswordStrengthBar from "react-password-strength-bar";

// import history from "../history";
// import "../css/form.css";

const GeneralForm = ({ fields, validateForm, apiRoute, strength, logged }) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [serverErr, setServerErr] = useState("");

  useEffect(() => {
    const object = {};

    for (const key of fields) {
      object[key.label] = "";
    }

    setValues(object);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let err = validateForm(values);
    setErrors(err);
    if (_.isEmpty(err)) {
      if ("Confirm password" in values) {
        delete values["confirmed password"];
      }
      axios
        .post(apiRoute, values)
        .then((response) => {
          if ("token" in response.data) {
            localStorage.setItem(
              "token",
              JSON.stringify(response.data["token"])
            );
            logged();
          } else if ("username" in response.data && "email" in response.data) {
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
          setServerErr(error.message);
          toggleShowMessage();
        });
    }
  };

  const toggleShowMessage = () => setShowMessage(!showMessage);

  const toast = () => {
    return (
      <Row>
        <Col xs={6}>
          <Toast show={showMessage} onClose={toggleShowMessage}>
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded mr-2"
                alt=""
              />
              <strong className="mr-auto">Error</strong>
              <small>{serverErr}</small>
            </Toast.Header>
            <Toast.Body>Input error, try again</Toast.Body>
          </Toast>
        </Col>
      </Row>
    );
  };

  const renderMuted = (field) => {
    if (field.muted) {
      return <Form.Text className="text-muted">{field.muted}</Form.Text>;
    }
  };

  const renderFields = () => {
    return fields.map((field) => {
      return (
        <Form.Group key={field.label}>
          <Form.Label htmlFor={field.label}>{field.label}</Form.Label>
          <Form.Control
            type={field.type}
            id={field.label}
            name={field.label}
            className={errors[field.label] ? "form-error" : ""}
            onChange={handleChange}
          />
          {renderMuted(field)}
          {errors[field.label] && (
            <p className="error-small">{errors[field.label]}</p>
          )}
          {field.label === "password" && strength && (
            <PasswordStrengthBar password={values[field.label]} />
          )}
        </Form.Group>
      );
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      {renderFields()}
      <Button variant="primary" type="submit">
        Send
      </Button>
      {toast()}
    </Form>
  );
};

export default GeneralForm;
