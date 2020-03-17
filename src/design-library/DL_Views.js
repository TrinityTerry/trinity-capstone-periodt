import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import * as firebase from "firebase";
import DLMaster from "./master";
import PT_AUTH from "../components/auth/PT_AUTH";
import APIManager from "../api-manager/APIManager";

const DL_Views = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [pages, setPages] = useState([
    "home",
    "buttons",
    "calendar",
    "cards",
    "checkboxes",
    "cycle",
    "icons",
    "inputs",
    "menus",
    "modals",
    "table",
  ]);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      setUserLoggedIn(true);
      setUserInfo(user);
    } else {
      setUserLoggedIn(false);
      setUserInfo(false);
    }
  });

  useEffect(() => {
    if (userInfo !== null) {
      APIManager.getData("users", userInfo.uid, "user_typeId").then(data => {
        APIManager.getData("user_types", data, "name").then(data =>
          data === "admin" ? setIsAdmin(true) : setIsAdmin(false)
        );
      });
    }
  }, [userInfo]);

  return (
    <>
      {isAdmin === null ? (
        <div>Loading...</div>
      ) : isAdmin ? (
        <>
          <Route
            exact
            path="/dl/:element"
            component={props => (
              <DLMaster
                pages={pages}
                page={props.match.params.element}
                {...props}
                userInfo={userInfo}
                setUserInfo={setUserInfo}
              />
            )}
          />
          <Route
            exact
            path="/dl"
            component={props => <Redirect to="/dl/home" />}
          />
        </>
      ) : (
        <>
          <Route
            exact
            path="/dl/:element"
            component={() => (
              <PT_AUTH
                userLoggedIn={userLoggedIn}
                providers={["google", "email"]}
                redirect_path={"dl/master"}
                user="admin"
              />
            )}
          />
          <Route
            exact
            path="/dl"
            component={props => <Redirect to="/dl/home" />}
          />
        </>
      )}
    </>
  );
};

export default DL_Views;
