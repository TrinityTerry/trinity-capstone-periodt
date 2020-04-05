import React, { useState } from "react";

import { Form } from "semantic-ui-react";
import PT_INPUT from "../inputs/PT_INPUT";
import APIManager from "../../modules/APIManager";
import PT_LOADER from "../loader/PT_LOADER";

const UpdateUserForm = ({ passInfo, missingUserInfo, missingUserData }) => {
  const [info, setInfo] = useState({
    nickname: "",
    first_name: "",
    last_name: "",
  });

  const [missingData, setData] = useState({
    photoURL: "",
  });

  const [errors, setErrors] = useState({
    nickname: false,
    first_name: false,
    last_name: false,
    photoURL: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e, { name, value }) => {
    const errObj = { ...errors };
    errObj[name] = false;
    if (name === "nickname" || name === "first_name" || name === "last_name") {
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
    setIsLoading(true);
    APIManager.findUserName(info.nickname.toLowerCase()).then((data) => {
      if (missingUserInfo.length > 0) {
        if (missingUserInfo.includes("nickname")) {
          if (info["nickname"] === "") {
            newObj["nickname"] = {
              content: "Please enter a nickname",
              pointing: "below",
            };
            formIsValid = false;
          } else if (!/^\S*$/.test(info["nickname"])) {
            newObj["nickname"] = {
              content: `Please enter a nickname without spacee. Ex: ${info[
                "nickname"
              ]
                .split(" ")
                .join("-")}, ${info["nickname"].split(" ").join("_")}, ${info[
                "nickname"
              ]
                .split(" ")
                .join("")}`,
              pointing: "below",
            };
            formIsValid = false;
          } else {
            newObj["nickname"] = false;
          }
        }

        if (missingUserInfo.includes("first_name")) {
          if (info["first_name"] === "") {
            newObj["first_name"] = {
              content: "Please enter your first name",
              pointing: "below",
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
              pointing: "below",
            };
            formIsValid = false;
          } else {
            newObj["last_name"] = false;
          }
        }
      }

      if (missingUserData === "photoURL") {
        if (missingData.photoURL === "") {
          newObj.photoURL = {
            content: "Please enter a photo url name",
            pointing: "below",
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
      setIsLoading(false);
    });
  };

  return (
    <div>
      <PT_LOADER active={isLoading} />
      <Form onSubmit={handleSubmit}>
        <Form.Group className="missing-info-form">
          {missingUserInfo.map((item) => {
            return (
              <>
                <PT_INPUT
                  error={errors[item]}
                  key={item}
                  placeholder={item.split("_").join(" ")}
                  name={item}
                  value={info[item]}
                  label={item.split("_").join(" ")}
                  handleChange={handleChange}
                />
                <hr />
              </>
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
          <hr />
          <Form.Button content="Submit" />
        </Form.Group>
      </Form>
    </div>
  );
};

export default UpdateUserForm;
