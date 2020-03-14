import React, { useEffect } from "react";
import * as firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import PT_Auth from "../library/auth/Auth";

const Auth = () => {
  return (
    <>
      <h1>Welcome to My Periodt</h1>
      <PT_Auth providers={["google", "email"]} redirect_path={""} />
    </>
  );
};

export default Auth;
