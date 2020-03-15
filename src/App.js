import React from "react";
import ApplicationViews from "./auth/ApplicationViews";
import DL_VIEWS from "./components/DL_Views";
import PT_BUTTON from "./components/buttons/PT_BUTTONS";
import PT_MENU from "./components/menus/PT_MENU";
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
