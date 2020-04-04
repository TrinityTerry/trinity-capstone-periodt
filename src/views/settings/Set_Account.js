import React, { useState, useEffect } from "react";
import PT_CARD from "../../components/cards/PT_CARD";
import PT_ICON from "../../components/icons/PT_ICON";
import Set_Card from "../../components/cards/Set_Card";
import PT_INPUT from "../../components/inputs/PT_INPUT";
import PT_BUTTON from "../../components/buttons/PT_BUTTON";
import * as firebase from "firebase";
import { Form } from "semantic-ui-react";

const Set_Account = ({ userData, userInfo }) => {
  const [accountValues, setAccountValues] = useState(
    {
      password: {
        current: "",
        password: "",
        reenter: ""
      }
    } || ""
  );
  const [profile, setProfile] = useState({});
  const [errors, setErrors] = useState({
    password: false,
    reenter: false,
    current: false
  });

  useEffect(() => {
    userData.providerData.forEach(function(profile) {
      setProfile(profile);
    });
  }, []);


  const handlePassword = e => {
    if (accountValues.password.password == accountValues.password.reenter) {
      if (
        accountValues.password.password == undefined ||
        accountValues.password.password.length == 0
      ) {
        const newObj = { ...errors };
        newObj.password = {
          content: "Please enter new password",
          pointing: "below"
        };
        newObj.reenter = true;
        setErrors(newObj);
      } else {
        if (accountValues.password.current.length > 0) {
          const cred = firebase.auth.EmailAuthProvider.credential(
            userData.email,
            accountValues.password.current
          );

          userData
            .reauthenticateWithCredential(cred)
            .then(function() {
              userData
                .updatePassword(accountValues.password.password)
                .then(function() {
                  alert("password changed");
                })
                .catch(function(error) {
                  alert("password change failed. Try again later");
                });
            })
            .catch(function(error) {
              const newObj = { ...errors };
              newObj.current = {
                content: "Invalid Password",
                pointing: "below"
              };
              setErrors(newObj);
            });
        } else {
          const newObj = { ...errors };
          newObj.current = {
            content: "Please enter current password",
            pointing: "below"
          };
          setErrors(newObj);
        }
      }
    } else {
      const newObj = { ...errors };
      newObj.password = {
        content: "Passwords Don't Match",
        pointing: "below"
      };
      newObj.reenter = true;
      setErrors(newObj);
    }
  };

  const handleChange = e => {
    if (
      e.target.name == "password" ||
      e.target.name == "reenter" ||
      e.target.name == "current"
    ) {
      const errorObj = { ...errors };
      errorObj.password = false;
      errorObj.reenter = false;
      setErrors(errorObj);
    }

    const newObj = { ...accountValues };
    newObj.password[e.target.name] = `${e.target.value}`;
    setAccountValues(newObj);
  };

  return (
    <>
      <Set_Card
        title="Account"
        userData={userData}
        userInfo={userInfo}
      />

      {profile.providerId == "password" ? (
        <PT_CARD
          cardArray={[
            {
              key: userData.uid + "password",
              header: "Change Password",
              description: (
                <Form>
                  <hr />
                  <p>Old Password</p>
                  <PT_INPUT
                    name="current"
                    type="password"
                    error={errors.current}
                    valueFromState={accountValues.password.current}
                    handleChange={handleChange}
                  />
                  <p>New Password</p>
                  <PT_INPUT
                    type="password"
                    name="password"
                    error={errors.password}
                    valueFromState={accountValues.password.password}
                    handleChange={handleChange}
                  />
                  <p>Confirm Password</p>
                  <PT_INPUT
                    type="password"
                    name="reenter"
                    error={errors.reenter}
                    valueFromState={accountValues.password.reenter}
                    handleChange={handleChange}
                  />
                  <br />
                  <PT_BUTTON
                    content="Update password"
                    handleClick={handlePassword}
                  />
                  {/* <p>Forgot Password</p> */}
                </Form>
              )
            }
          ]}
          indiv={false}
          centered={true}
        />
      ) : (
        <PT_CARD
          centered={true}
          header={`To change password, go change your password on Google`}
        />
      )}
    </>
  );
};

export default Set_Account;