import React, { useState, useEffect } from "react";
import Set_Home from "./settings/Set_Home";
import Set_Profile from "./settings/Set_Profile";
import Set_Account from "./settings/Set_Account";
import Set_Cycle from "./settings/Set_Cycle";
import SET_ABOUT from "./settings/SET_ABOUT";
import MyPeriods from "./MyPeriods";
import Set_Notifications from "./settings/Set_Notifications";
import PT_CARD from "../components/cards/PT_CARD";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_CALENDAR from "../components/calendar/PT_CALENDAR";
import PT_INPUT from "../components/inputs/PT_INPUT";
const Settings = ({ userData, userInfo, page, match, history }) => {
  const [userInfoInput, setUserInfoInput] = useState(userInfo);
  const [content, setContent] = useState("");

  useEffect(() => {
    match.params.category === "home" &&
      setContent(<Set_Home userData={userData} userInfo={userInfo} />);
    match.params.category === "profile" &&
      setContent(<Set_Profile userData={userData} userInfo={userInfo} />);
    match.params.category === "account" &&
      setContent(
        <Set_Account
          history={history}
          userData={userData}
          userInfo={userInfo}
        />
      );
    match.params.category === "period&cycle" &&
      setContent(
        <Set_Cycle match={match} userData={userData} userInfo={userInfo} />
      );
    match.params.category === "history" &&
      setContent(
        <MyPeriods match={match} userData={userData} userInfo={userInfo} />
      );
    match.params.category === "about" &&
      setContent(
        <SET_ABOUT match={match} userData={userData} userInfo={userInfo} />
      );

    // match.params.category === "notifications" &&
    //   setContent(<Set_Notifications userData={userData} userInfo={userInfo} />);
  }, [match]);

  const handleChange = (e) => {
    const newObj = { userInfoInput };
    newObj[e.target.name] = e.target.value;
    setUserInfoInput(newObj);
  };

  return <>{content}</>;
};

export default Settings;
