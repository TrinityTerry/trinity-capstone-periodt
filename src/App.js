import React from "react";
import "./App.css";
import ApplicationViews from "./ApplicationViews";
import DL_VIEWS from "./library/DL_Views";
import PT_BUTTON from "./library/buttons/PT_Buttons";
import PT_MENU from "./library/menus/PT_Menu";
import * as firebase from "firebase/app";

const App = props => {
  const logout = () => {
    firebase.auth().signOut();
  };
  return (
    <>
      <PT_MENU
        title={"Periodt"}
        page={"home"}
        path={""}
        links={["home", "cards"]}
        type={"navbar"}
        element={<PT_BUTTON handleClick={logout} content={"Log Out"} />}
      />

      <ApplicationViews />
      <DL_VIEWS />
    </>
  );
};

export default App;
