import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Toast, Modal } from "react-bootstrap";
import _ from "lodash";
import axios from "axios";
import PasswordStrengthBar from "react-password-strength-bar";

import { Link } from "react-router-dom";

// import history from "../history";
// import "../css/form.css";

const GeneralForm = ({ fields, validateForm, apiRoute, strength, submit }) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [serverErr, setServerErr] = useState("");
  const [formErr, setFormErr] = useState({});

  useEffect(() => {
    const object = {};

    for (const key of fields) {
      object[key.name] = "";
    }

    setValues(object);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (event) => {
    if (event.target.name === "num_days" || event.target.name === "num_reps") {
      setValues({
        ...values,
        [event.target.name]: parseInt(event.target.value),
      });
    } else {
      setValues({
        ...values,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let err = validateForm(values);
    setErrors(err);
    if (_.isEmpty(err)) {
      if (!("sim_model" in values)) {
        if ("confirm password" in values) {
          delete values["confirmed password"];
        }
        axios
          .post(apiRoute, values)
          .then((response) => {
            submit(response, values);
          })
          .catch((error) => {
            setServerErr(error.message);
            toggleShowMessage();
          });
      } else {
        axios
          .post(apiRoute, values, {
            headers: {
              Authorization: `token ${JSON.parse(
                localStorage.getItem("token")
              )}`,
            },
          })
          .then((response) => {
            toggleSuccessModal();
          })
          .catch((error) => {
            setServerErr(error.message);
            toggleShowMessage();
            setTimeout(toggleShowMessage(), 5);
          });
      }
    } else {
      setFormErr(err);
      toggleShowModal();
    }
  };

  const toggleShowMessage = () => setShowMessage(!showMessage);

  const toggleShowModal = () => setShowModal(!showModal);

  const toggleSuccessModal = () => setShowSuccessModal(!showSuccessModal);

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

  const formErrors = () => {
    let err = [];
    for (const [, value] of Object.entries(formErr)) {
      err.push(value);
    }

    return err.map((e) => {
      return <li>{e}</li>;
    });
  };

  const modal = () => {
    return (
      <Modal show={showModal} onHide={toggleShowModal}>
        <Modal.Header closeButton>
          <Modal.Title>Input Error(s) found</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ul>{formErrors()}</ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={toggleShowModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const successModal = () => {
    return (
      <Modal show={showSuccessModal} onHide={toggleSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Your simulation has been created</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Link to="/petitions">
            <Button variant="secondary">Go to simulations</Button>
          </Link>
          <Button variant="primary" onClick={toggleSuccessModal}>
            Create another simulation
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderMuted = (field) => {
    if (field.muted) {
      return <Form.Text className="text-muted">{field.muted}</Form.Text>;
    }
  };

  const renderFields = () => {
    return fields.map((field) => {
      if (field.type === "select") {
        return (
          <Form.Group key={field.label}>
            <Form.Label htmlFor={field.label}>{field.label}</Form.Label>
            <Form.Control
              as={field.type}
              id={field.label}
              name={field.name}
              className={errors[field.name] ? "form-error" : ""}
              onChange={handleChange}
            >
              {field.options.map((option) => {
                return (
                  <option key={option.name} value={option.value}>
                    {option.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        );
      }
      return (
        <Form.Group key={field.label}>
          <Form.Label htmlFor={field.label}>{field.label}</Form.Label>
          <Form.Control
            type={field.type}
            id={field.label}
            name={field.name}
            className={errors[field.name] ? "form-error" : ""}
            onChange={handleChange}
          />
          {renderMuted(field)}
          {errors[field.label] && (
            <p className="error-small">{errors[field.name]}</p>
          )}
          {field.label === "password" && strength && (
            <PasswordStrengthBar password={values[field.name]} />
          )}
        </Form.Group>
      );
    });
  };

  return (
    <Form id="form" onSubmit={handleSubmit}>
      {renderFields()}
      <Button variant="primary" type="submit">
        Send
      </Button>
      {toast()}
      {modal()}
      {successModal()}
    </Form>
  );
};

export default GeneralForm;
