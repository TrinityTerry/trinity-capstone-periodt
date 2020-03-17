import React, { useState } from "react";
import { Route, useHistory } from "react-router-dom";
import * as firebase from "firebase";
import Home from "../views/Home";
import Auth from "../views/Login";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_MENU from "../components/menus/PT_MENU";

const ApplicationViews = props => {
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [history] = useState(useHistory());

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      setUserLoggedIn(true);
      setUserInfo(user);
    } else {
      setUserLoggedIn(false);
      setUserInfo(false);
    }
  });

  const logout = () => {
    firebase.auth().signOut();
    history.push("/");
    
  };

  return (
    <>
      { userLoggedIn && 
      
      <PT_MENU
        title={"Periodt"}
        page={"home"}
        path={""}
        links={["home", "cards"]}
        type={"navbar"}
        element={
          <PT_BUTTON
            handleClick={logout}
            basic={true}
            content={"Log Out"}
            icon={"sign out alternate"}
            iconPosition="right"
          />
        }
      />}

      <Route
        exact
        path="/"
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
