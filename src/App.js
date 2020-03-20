import React from "react";
import ApplicationViews from "./main-router/ApplicationViews";
import DL_VIEWS from "./design-library/DL_Views";
import * as firebase from "firebase/app";

const App = props => {

  return (
    <>
      <ApplicationViews />
      <DL_VIEWS />
    </>
  );
};

export default App;
