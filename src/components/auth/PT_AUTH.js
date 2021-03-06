import React, { useEffect, useState } from "react";
import * as firebase from "firebase/app";
import * as firebaseui from "firebaseui";

const PT_AUTH = ({ providers = ["google", "email"], redirect_path, user }) => {
  const [ui, setUi] = useState(
    firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth())
  );
  useEffect(() => {
    const signInOptionArray = providers.map((prov) => {
      return prov === "google"
        ? firebase.auth.GoogleAuthProvider.PROVIDER_ID
        : prov === "email" && firebase.auth.EmailAuthProvider.PROVIDER_ID;
    });
    var uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          return true;
        },
        uiShown: function () {},
      },
      signInFlow: "popup",
      signInSuccessUrl: window.location.href.includes("3000")
        ? `http://localhost:3000/${redirect_path}`
        : `https://periodt.netlify.com/${redirect_path}`,
      signInOptions: signInOptionArray,
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  }, []);

  useEffect(() => {
    return () => {
      ui.delete();
    };
  }, []);

  return (
    <>
      <div className="pt-auth-message">
        {user === "admin" && "Please sign in using Admin account"}
      </div>
      <div id="firebaseui-auth-container"></div>
    </>
  );
};

export default PT_AUTH;
