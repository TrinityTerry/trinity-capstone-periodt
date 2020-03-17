import React from "react";
import ApplicationViews from "./auth/ApplicationViews";
import DL_VIEWS from "./design-library/DL_Views";
import PT_BUTTON from "./components/buttons/PT_BUTTON";
import PT_ICON from "./components/icons/PT_ICON";
import PT_MENU from "./components/menus/PT_MENU";
import PT_MODAL from "./components/modals/PT_MODAL";
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
        element={<PT_BUTTON handleClick={logout} basic={true} content={"Log Out"} icon={'sign out alternate'} iconPosition="right"/>}
      />

      <ApplicationViews />
      <DL_VIEWS />
    </>
  );
};

export default App;
