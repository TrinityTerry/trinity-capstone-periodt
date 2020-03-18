import React, { useState, useEffect } from "react";
import { Route, useHistory, Switch, Redirect } from "react-router-dom";
import * as firebase from "firebase";
import Home from "../views/Home";
import Auth from "../views/Login";
import MyLogs from "../views/MyLogs";
import AddLog from "../views/AddLog";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_MENU from "../components/menus/PT_MENU";
import APIManager from "../api-manager/APIManager";

const ApplicationViews = props => {
  const [userInfo, setUserInfo] = useState(null);
  const [userData, setUserData] = useState(null);
  const [history] = useState(useHistory());
  const [missingUserInfo, setMissingUserInfo] = useState([]);
  const [missingUserData, setMissingUserData] = useState(null);

  const refreshUser = () => {
    var user = firebase.auth().currentUser;
    if (user) {
      APIManager.getUserInfo(user.uid)
        .then(data => data[user.uid])
        .then(setUserInfo);
    } else {
    }
  };

  firebase
    .database()
    .ref("users")
    .on("child_changed", snapshot => {
      refreshUser();
    });

  const getMissingInfo = () => {
    if (userInfo) {
      const missingInfoArray = [];
      !userInfo.username && missingInfoArray.push("username");
      !userInfo.first_name && missingInfoArray.push("first_name");
      !userInfo.last_name && missingInfoArray.push("last_name");
      !userInfo.is_active && missingInfoArray.push("is_active");
      setMissingUserInfo(missingInfoArray);
    }
  };

  const getMissingData = () => {
    if (userData) {
      setMissingUserData(!userData.photoURL ? "photoURL" : null);
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
      {userInfo && (
        <PT_MENU
          title={"Periodt"}
          page={"home"}
          path={""}
          links={["Home", "Add Log", `My Calendar`, `My Logs`, "Settings"]}
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
      <Switch>
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
                {...props}
                getMissingInfo={getMissingInfo}
                getMissingData={getMissingData}
                refreshUser={refreshUser}
                userData={userData}
                userInfo={userInfo}
                logout={logout}
                missingUserInfo={missingUserInfo}
                missingUserData={missingUserData}
              />
            )
          }
        />
        {!userData && userData !== null && <Redirect to="/" />}
        {userData && (
          <>
            <Route
              exact
              path="/add-log"
              render={props => (
                <AddLog {...props} userData={userData} userInfo={userInfo} />
              )}
            />
            <Route exact path="/my-logs" render={props => <MyLogs />} />
            <Route
              exact
              path="/calendar"
              render={props =>
                userInfo &&
                userInfo.averageCycleDays > 0 && (
                  <div>You'll need to add a period to access this fature</div>
                )
              }
            />
            <Route
              exact
              path="/logout"
              render={props => {
                logout();
              }}
            />
          </>
        )}
      </Switch>
      <Switch>
        <Route
          exact
          path="/dl"
          component={props => <Redirect to="/dl/home" />}
        />
      </Switch>
    </>
  );
};

export default ApplicationViews;
