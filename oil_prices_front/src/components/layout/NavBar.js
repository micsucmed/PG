import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";

const Navigation = (props) => {
  const renderLogin = () => {
    if (props.user == null) {
      return (
        <Nav.Item>
          <Nav.Link as={Link} to="/login">
            <Button variant="secondary">Login</Button>
          </Nav.Link>
        </Nav.Item>
      );
    } else {
      return (
        <Nav.Item onClick={() => props.logout()}>
          <Nav.Link as={Link} to="/">
            <Button variant="secondary">Sign out</Button>
          </Nav.Link>
        </Nav.Item>
      );
    }
  };

  const renderMenu = () => {
    if (props.user !== null) {
      return (
        <Nav.Item>
          <Nav.Link as={Link} to="/petitions">
            Simulation
          </Nav.Link>
        </Nav.Item>
      );
    }
  };

  return (
    <React.Fragment>
      <Navbar sticky="top" variant="dark">
        <Navbar.Brand as={Link} to="/">
          OIL PRICES
        </Navbar.Brand>
        <Nav className="mr-auto">{renderMenu()}</Nav>
        <Nav>{renderLogin()}</Nav>
      </Navbar>
    </React.Fragment>
  );
};

export default Navigation;
