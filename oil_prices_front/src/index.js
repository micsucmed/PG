import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import App from "./components/App";

import ApiURL from "./locales/url.json";

function getApiURL() {
  return ApiURL;
}

ReactDOM.render(<App url={getApiURL().URL} />, document.getElementById("root"));

serviceWorkerRegistration.register();
