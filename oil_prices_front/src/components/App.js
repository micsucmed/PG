import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import axios from "axios";
import Nav from "./layout/NavBar";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Home from "./Home";
import Petitions from "./petition/Petitions";
import Simulation from "./simulation/Simulation";
import "../css/styles.css";

function App({ url }) {
  const [user, setUser] = useState(null);

  const fetchData = useCallback(async () => {
    const result = await axios.get(url + "api/accounts/current-user/", {
      headers: {
        Authorization: `token ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    setUser(result.data);
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const logout = () => {
    localStorage.setItem("token", null);
    setUser(null);
  };

  return (
    <Router>
      <Nav user={user} logout={logout} />
      <main className="pt-5">
        <div className="body">
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
            {user !== null ? (
              <Redirect to="/" />
            ) : (
              <Login url={url} logged={fetchData} />
            )}
          </Route>
          <Route exact path="/signup">
            {user !== null ? (
              <Redirect to="/" />
            ) : (
              <Signup url={url} logged={fetchData} />
            )}
          </Route>
          <Route exact path="/petitions">
            <Petitions url={url} />
          </Route>
          <Route exact path={"/petitions/detail/:id/"}>
            <Simulation url={url} />
          </Route>
        </div>
      </main>
    </Router>
  );
}

export default App;
