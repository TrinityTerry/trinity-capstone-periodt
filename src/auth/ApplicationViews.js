import React, { useState } from "react";
import { Route } from "react-router-dom";
import * as firebase from "firebase";
import Home from "../views/Home";
import Auth from "../views/Login";

const ApplicationViews = props => {
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      setUserLoggedIn(true);
      setUserInfo(user);
    } else {
      setUserLoggedIn(false);
      setUserInfo(false);
    }
  });

  return (
    <>
      <Route
        exact
        path="/home"
        render={props =>
          userLoggedIn === null ? (
            <div>Loading...</div>
          ) : !userLoggedIn ? (
            <Auth props={props} />
          ) : (
            <Home userInfo={userInfo} />
          )
        }
      />
    </>
  );
};

export default ApplicationViews;
