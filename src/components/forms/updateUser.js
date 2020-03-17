import React, { useState } from "react";

import { Form } from "semantic-ui-react";
import PT_INPUT from "../inputs/PT_INPUT";
import APIManager from "../../api-manager/APIManager";

const UpdateUserForm = ({ passInfo, missingUserInfo }) => {
  const [info, setInfo] = useState({
    username: "",
    first_name: "",
    last_name: ""
  });
  const [errors, setErrors] = useState({
    username: false,
    first_name: false,
    last_name: false
  });
  const handleChange = (e, { name, value }) => {
    const newObj = { ...info };
    const errObj = { ...errors };
    errObj[name] = false;
    newObj[name] = value;
    setErrors(errObj);
    setInfo(newObj);
  };

  const handleSubmit = () => {
    const newObj = { ...errors };
    let formIsValid = true;
    APIManager.findUserName(info.username.toLowerCase()).then(data => {
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

      if (info["first_name"] === "") {
        newObj["first_name"] = {
          content: "Please enter your first name",
          pointing: "below"
        };
        formIsValid = false;
      } else {
        newObj["irst_name"] = false;
      }

      if (info["last_name"] === "") {
        newObj["last_name"] = {
          content: "Please enter your last name",
          pointing: "below"
        };
        formIsValid = false;
      } else {
        newObj["last_name"] = false;
      }

      if (formIsValid) {
        passInfo(info);
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
          <Form.Button content="Submit" />
        </Form.Group>
      </Form>
    </div>
  );
};

export default UpdateUserForm;
