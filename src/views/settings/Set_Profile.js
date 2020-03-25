import React, { useState, useEffect } from "react";
import PT_CARD from "../../components/cards/PT_CARD";
import PT_ICON from "../../components/icons/PT_ICON";
import PT_INPUT from "../../components/inputs/PT_INPUT";
import PT_BUTTON from "../../components/buttons/PT_BUTTON";
import { Form } from "semantic-ui-react";
import { Link } from "react-router-dom";
import Set_Card from "../../components/cards/Set_Card";
import APIManager from "../../modules/APIManager";
const Set_Profile = ({ userData, userInfo }) => {
  const [userInfoInput, setUserInfoInput] = useState(userInfo);
  const [content, setContent] = useState("");

  const handleChange = e => {
    const newObj = { ...userInfoInput };
    newObj[e.target.name] = e.target.value;

    setUserInfoInput(newObj);
  };

  const handleSave = e => {
    APIManager.updateUser(userInfoInput, userData.uid).then(() => {
      alert("Profile Updated");
    });
  };
  return (
    <>
      <Set_Card
        title="Profile"
        userData={userData}
        userInfo={userInfo}
        handleClick={handleSave}
      />
      <PT_CARD
        image={
          userInfo.photoURL
            ? userInfo.photoURL
            : "https://react.semantic-ui.com/images/wireframe/white-image.png"
        }
        centered={true}
      />

      <PT_CARD
        cardArray={[
          {
            key: userData.uid + "first",
            header: "First Name",
            description: (
              <PT_INPUT
                name="first_name"
                valueFromState={userInfoInput.first_name}
                handleChange={handleChange}
              />
            )
          },
          {
            key: userData.uid + "last",
            header: "Last Name",
            description: (
              <PT_INPUT
                name="last_name"
                valueFromState={userInfoInput.last_name}
                handleChange={handleChange}
              />
            )
          },
          {
            key: userData.uid + "nickname",
            header: "nickname",
            description: (
              <PT_INPUT
                name="nickname"
                valueFromState={userInfoInput.nickname}
                handleChange={handleChange}
              />
            )
          },
          {
            key: userData.uid + "photo",
            header: "Photo URL",
            description: (
              <PT_INPUT
                name="photoURL"
                valueFromState={userInfoInput.photoURL}
                handleChange={handleChange}
              />
            )
          },
          {
            key: userData.uid + "save",
            description: <PT_BUTTON content="Save" handleClick={handleSave} />
          }
        ]}
        indiv={false}
        centered={true}
      />
    </>
  );
};

export default Set_Profile;
