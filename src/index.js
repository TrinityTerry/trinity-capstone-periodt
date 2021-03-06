import React from "react";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import firebaseConfig from "./FBConfig";

import "./styles/index.scss";
import * as serviceWorker from "./serviceWorker";
import * as firebase from "firebase/app";
import "firebase/analytics";

firebase.initializeApp(firebaseConfig);

firebase.analytics();

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
