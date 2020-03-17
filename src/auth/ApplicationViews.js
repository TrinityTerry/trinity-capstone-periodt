import React, { useState, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import * as firebase from "firebase";
import Home from "../views/Home";
import Auth from "../views/Login";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_MENU from "../components/menus/PT_MENU";
import APIManager from "../api-manager/APIManager";

const ApplicationViews = props => {
  const [userInfo, setUserInfo] = useState(null);
  const [userData, setUserData] = useState(null);
  const [history] = useState(useHistory());

  const refreshUser = () => {
    var user = firebase.auth().currentUser;
    if (user) {
      APIManager.getUserInfo(user.uid)
        .then(data => data[user.uid])
        .then(setUserInfo);
    } else {
    }
  };

  useEffect(() => {
    refreshUser();
  }, [userData]);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      setUserData(user);
    } else {
      setUserData(false);
      setUserInfo(false);
    }
  });

  const logout = () => {
    firebase.auth().signOut();
    history.push("/");
  };

  return (
    <>
      {userData && (
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
        />
      )}

      <Route
        exact
        path="/"
        render={props =>
          userData === null ? (
            <div>Loading...</div>
          ) : !userData ? (
            <Auth props={props} />
          ) : (
            <Home
              refreshUser={refreshUser}
              userData={userData}
              userInfo={userInfo}
              logout={logout}
            />
          )
        }
      />
    </>
  );
};

export default ApplicationViews;
