import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import ApplicationViews from "./ApplicationViews";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import * as firebase from "firebase/app";
import PT_Button from "./library/buttons/Buttons";

import "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZ7LMzQOtuc4Aq7vDbIOdA7XMtNKXHeAE",
  authDomain: "periodt-1584121712792.firebaseapp.com",
  databaseURL: "https://periodt-1584121712792.firebaseio.com",
  projectId: "periodt-1584121712792",
  storageBucket: "periodt-1584121712792.appspot.com",
  messagingSenderId: "35727609221",
  appId: "1:35727609221:web:898b35a5dd675dc41a88ec",
  measurementId: "G-2NT4LW2YFK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var refreshToken; // Get refresh token from OAuth2 flow

const logout = () => {
  firebase.auth().signOut();
};


ReactDOM.render(
  <Router>
    <PT_Button handleClick={logout} content={"Log Out"}/>
    <ApplicationViews />
  </Router>,
  document.getElementById("root")
);

serviceWorker.unregister();
