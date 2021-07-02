import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";

import App from "./components/App";

import ApiURL from "./locales/url.json";

function getApiURL() {
  return ApiURL;
}

ReactDOM.render(<App url={getApiURL().URL} />, document.getElementById("root"));

serviceWorkerRegistration.register();
