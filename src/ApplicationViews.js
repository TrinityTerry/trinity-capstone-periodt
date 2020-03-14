import React, { useState } from "react";
import App from "./App";
import { Route } from "react-router-dom";
import * as firebase from "firebase";
import Home from "../src/home/Home"
import DLMaster from "./library/master"
import Auth from "./auth//Auth";


const ApplicationViews = props => {
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      setUserLoggedIn(true);
      setUserInfo(user)
    } else {
      setUserLoggedIn(false);
      setUserInfo(false)
    }
  });

  return (
      <>
    <Route
      exact
      path="/"
      render={props =>
        userLoggedIn === null ? <div>Loading...</div> : !userLoggedIn ? <Auth props={props} /> : <Home userInfo={userInfo}/>
      }
    />

    <Route
      exact
      path="/dl/master"
      render={props =>
        <DLMaster userInfo={userInfo} setUserInfo={setUserInfo}/>
      }
    />
    </>
  );
};

export default ApplicationViews;
