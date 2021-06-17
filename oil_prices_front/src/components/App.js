import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import axios from "axios";
import Nav from "./layout/NavBar";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Home from "./Home";
import "../css/styles.css";

function App({ url }) {
  const [apiURL, setApiURL] = useState();
  const [user, setUser] = useState(null);

  const fetchData = useCallback(async () => {
    const result = await axios.get(url + "api/accounts/current-user/", {
      headers: {
        "Authorization": `token ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    setUser(result.data);
  }, [url]);

  useEffect(() => {
    fetchData();
    const URL = url;
    setApiURL(URL);
  }, [fetchData, url]);

  const logout = () => {
    localStorage.setItem("token", null);
    setUser(null);
  };

  return (
    <Router>
      <Route path="/">
        <Nav user={user} logout={logout} />
      </Route>
      <main>
        <div className="body">
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
            {user !== null ? (
              <Redirect to="/" />
            ) : (
              <Login url={apiURL} logged={fetchData} />
            )}
          </Route>
          <Route exact path="/signup">
            <Signup url={apiURL} />
          </Route>
        </div>
      </main>
    </Router>
  );
}

export default App;
