import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import * as firebase from "firebase";
import DLMaster from "./master";
import PT_AUTH from "./auth/Auth";
import APIManager from "../api-manager/APIManager";

const DL_Views = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [pages, setPages] = useState(["home", "buttons", "calendar", "menus"]);

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
            render={props => {
              // return pages.includes(props.match.params.element) ? (
                return <DLMaster
                  pages={pages}
                  page={props.match.params.element}
                  {...props}
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                />
              // ) : (
              //   props.history.goBack()
              // );
            }}
          />
          <Route
            exact
            path="/dl"
            render={props => <Redirect to="/dl/home" />}
          />
        </>
      ) : (
        <>
          <Route
            exact
            path="/dl/:element"
            render={props =>
              props.match.params.element == "home" ? (
                <>
                  <div>Please sign into an admin account to view this page</div>
                  <PT_AUTH
                    providers={["google", "email"]}
                    redirect_path={"dl/master"}
                  />
                </>
              ) : (
                <Redirect to="/dl/home" />
              )
            }
          />
          <Route
            exact
            path="/dl"
            render={props => <Redirect to="/dl/home" />}
          />
        </>
      )}
    </>
  );
};

export default DL_Views;
