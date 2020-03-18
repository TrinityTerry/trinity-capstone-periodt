import React, { useState } from "react";

import { Form } from "semantic-ui-react";
import PT_INPUT from "../inputs/PT_INPUT";
import APIManager from "../../api-manager/APIManager";

const UpdateUserForm = ({ passInfo, missingUserInfo, missingUserData }) => {
  const [info, setInfo] = useState({
    username: "",
    first_name: "",
    last_name: ""
  });

  const [missingData, setData] = useState({
    photoURL: ""
  });

  const [errors, setErrors] = useState({
    username: false,
    first_name: false,
    last_name: false,
    photoURL: false
  });

  const handleChange = (e, { name, value }) => {
    const errObj = { ...errors };
    errObj[name] = false;
    if (name === "username" || name === "first_name" || name === "last_name") {
      const newObj = { ...info };
      newObj[name] = value;
      setInfo(newObj);
    } else {
      const newObj = { ...missingData };
      newObj[name] = value;
      setData(newObj);
    }
    setErrors(errObj);
  };

  const handleSubmit = () => {
    const newObj = { ...errors };
    let formIsValid = true;
    APIManager.findUserName(info.username.toLowerCase()).then(data => {
      if (missingUserInfo.length > 0) {
        if (missingUserInfo.includes("username")) {
          if (info["username"] === "") {
            newObj["username"] = {
              content: "Please enter a username",
              pointing: "below"
            };
            formIsValid = false;
          } else if (!/^\S*$/.test(info["username"])) {
            newObj["username"] = {
              content: `Please enter a username without spacee. Ex: ${info[
                "username"
              ]
                .split(" ")
                .join("-")}, ${info["username"].split(" ").join("_")}, ${info[
                "username"
              ]
                .split(" ")
                .join("")}`,
              pointing: "below"
            };
            formIsValid = false;
          } else if (Object.keys(data).length > 0) {
            newObj["username"] = {
              content: "username's taken",
              pointing: "below"
            };
            formIsValid = false;
          } else {
            newObj["username"] = false;
          }
        }

        if (missingUserInfo.includes("first_name")) {
          if (info["first_name"] === "") {
            newObj["first_name"] = {
              content: "Please enter your first name",
              pointing: "below"
            };
            formIsValid = false;
          } else {
            newObj["irst_name"] = false;
          }
        }

        if (missingUserInfo.includes("last_name")) {
          if (info["last_name"] === "") {
            newObj["last_name"] = {
              content: "Please enter your last name",
              pointing: "below"
            };
            formIsValid = false;
          } else {
            newObj["last_name"] = false;
          }
        }
      }

      if (missingUserData == "photoURL") {
        if (missingData.photoURL === "") {
          newObj.photoURL = {
            content: "Please enter a photo url name",
            pointing: "below"
          };
          formIsValid = false;
        } else {
          newObj.photoURL = false;
        }
      }

      if (formIsValid) {
        passInfo(info, missingData);
      }
      setErrors(newObj);
    });
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          {missingUserInfo.map(item => {
            return (
              <PT_INPUT
                error={errors[item]}
                key={item}
                placeholder={item.split("_").join(" ")}
                name={item}
                value={info[item]}
                label={item.split("_").join(" ")}
                handleChange={handleChange}
              />
            );
          })}

          {missingUserData && (
            <PT_INPUT
              error={errors[missingUserData]}
              key={missingUserData}
              placeholder={missingUserData}
              name={missingUserData}
              value={missingData[missingUserData]}
              label={missingUserData}
              handleChange={handleChange}
            />
          )}
          <Form.Button content="Submit" />
        </Form.Group>
      </Form>
    </div>
  );
};

export default UpdateUserForm;
