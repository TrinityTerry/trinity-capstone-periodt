import React from "react";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
// import firebaseConfig from "./FBConfig";

import "./styles/index.scss";
import * as serviceWorker from "./serviceWorker";
import * as firebase from "firebase/app";
import "firebase/analytics";


// Initialize Firebase
if (!window.location.href.includes("localhost")) {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_PT_API_KEY,
    authDomain: process.env.REACT_APP_PT_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_PT_DATABASE_URL,
    projectId: process.env.REACT_APP_PT_PROJECT_ID,
    storageBucket: process.env.REACT_APP_PT_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_PT_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_PT_APP_ID,
    measurementId: process.env.REACT_APP_PT_MEASUREMENT_ID
  };

  firebase.initializeApp(firebaseConfig);
} else {
  // firebase.initializeApp(firebaseConfig);
}

firebase.analytics();

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
