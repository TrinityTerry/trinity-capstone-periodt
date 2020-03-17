import React, { useEffect, useState } from "react";
import APIManager from "../api-manager/APIManager";
import PT_MODAL from "../components/modals/PT_MODAL";
import PT_INPUT from "../components/inputs/PT_INPUT";

import "firebase/database";

const Home = ({ userData, userInfo, refreshUser,logout }) => {
  const [hasAllUserInfo, setHasAllUserInfo] = useState(true);
  const [missingUserInfo, setMissingUserInfo] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [updateInputs, setUpdateInputs] = useState([]);
  const [updateInputValues, setUpdateInputValues] = useState({
    Username: "",
    "First-Name": "",
    "Last-Name": "",
    is_active: ""
  });
  const [updateInputError, setUpdateInputError] = useState({
    Username: true,
    "First-Name": true,
    "Last-Name": true,
    is_active: true
  });

  useEffect(() => {
    if (userInfo !== null) {
      if (!userInfo) {
        APIManager.createNewUser(userData.uid);
        refreshUser();
      }
    }

    if (userInfo) {
      const missingInfoArray = [];

      !userInfo.username && missingInfoArray.push("Username");
      !userInfo.first_name && missingInfoArray.push("First-Name");
      !userInfo.last_name && missingInfoArray.push("Last-Name");
      !userInfo.is_active && missingInfoArray.push("is_active");
      setMissingUserInfo(missingInfoArray);
    }
  }, [userInfo]);

  const handleChange = e => {
    let changeObj = { ...updateInputValues };
    changeObj[e.target.id] = e.target.value;
    setUpdateInputValues(changeObj);
  };

  const handleAction = e => {
    console.log(e.target.id);
    if(e.target.id == "cancel"){
      logout();
    }
    
  };

  useEffect(() => {
    if (missingUserInfo.length > 0) {
      const newArray = missingUserInfo.map(item => {
        return (
          <PT_INPUT
            error={updateInputError[item]}
            key={item}
            handleChange={handleChange}
            inputId={item}
            label={item.split("-").join(" ")}
            valueFromState={updateInputValues[item]}
          ></PT_INPUT>
        );
      });

      setUpdateInputs(newArray);
      setOpenModal(true);
    }
  }, [missingUserInfo]);

  return (
    <>
      <input type="text"></input>
      <PT_MODAL
        content={{
          modalHeader: "Update Account",
          descriptionHeader: "Update account information to continue",
          mainText: updateInputs
        }}
        isOpen={openModal}
        handleAction={handleAction}
        actionItems={["cancel", "submit"]}
      />
    </>
  );
};

export default Home;
// "Fri, 13 Mar 2020 21:36:37 GMT"
