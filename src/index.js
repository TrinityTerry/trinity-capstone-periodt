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

// Your web app's Firebase configuration

// Initialize Firebase
if (!window.location.href.includes("localhost")) {
  firebaseConfig = {
    apiKey: process.env.PT_API_KEY,
    authDomain: process.env.PT_AUTH_DOMAIN,
    databaseURL: process.env.PT_DATABASE_URL,
    projectId: process.env.PT_PROJECT_ID,
    storageBucket: process.env.PT_STORAGE_BUCKET,
    messagingSenderId: process.env.PT_MESSAGING_SENDER_ID,
    appId: process.env.PT_APP_ID,
    measurementId: process.env.PT_MEASUREMENT_ID
  };
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.initializeApp(firebaseConfig);
}

firebase.analytics();

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
