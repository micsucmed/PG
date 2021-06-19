import React from "react";
import { Link } from "react-router-dom";

const Nav = (props) => {
  const renderLogin = () => {
    if (props.user == null) {
      return (
        <li className="nav-item mx-0 mx-lg-1">
          <Link
            className="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger"
            to="/login"
          >
            Login
          </Link>
        </li>
      );
    } else {
      return (
        <li className="nav-item mx-0 mx-lg-1" onClick={() => props.logout()}>
          <Link
            className="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger"
            to="/"
          >
            Logout
          </Link>
        </li>
      );
    }
  };

  const renderMenu = () => {
    if (props.user !== null) {
      return (
        <li className="nav-item mx-0 mx-lg-1" key="Simulations">
          <Link
            className="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger"
            to="/petitions"
          >
            Simulation
          </Link>
        </li>
      );
    }
  };

  return (
    <React.Fragment>
      <nav
        className="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top"
        id="mainNav"
      >
        <Link to="/" className="navbar-brand js-scroll-trigger">
          OIL PRICES
        </Link>
        <ul className="navbar-nav ml-auto">
          {renderMenu()}
          {renderLogin()}
        </ul>
      </nav>
    </React.Fragment>
  );
};

export default Nav;
