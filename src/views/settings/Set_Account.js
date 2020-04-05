import React, { useState, useEffect } from "react";
import PT_CARD from "../../components/cards/PT_CARD";
import PT_ICON from "../../components/icons/PT_ICON";
import Set_Card from "../../components/cards/Set_Card";
import PT_INPUT from "../../components/inputs/PT_INPUT";
import PT_BUTTON from "../../components/buttons/PT_BUTTON";
import PT_MODAL from "../../components/modals/PT_MODAL";
import * as firebase from "firebase";
import { Form } from "semantic-ui-react";
import { Link } from "react-router-dom";
import PT_PROGRESS from "../../components/loader/PT_PROGRESS";
/* 



          
*/
const Set_Account = ({ userData, userInfo, history, setSnackbarObj }) => {
  const [accountValues, setAccountValues] = useState(
    {
      password: {
        current: "",
        password: "",
        reenter: "",
      },
    } || ""
  );
  const [profile, setProfile] = useState({});
  const [errors, setErrors] = useState({
    password: false,
    reenter: false,
    current: false,
  });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState({
    loading: false,
    left: 0,
    progress: 0,
  });
  useEffect(() => {
    userData.providerData.forEach(function (profile) {
      setProfile(profile);
    });
  }, []);

  const handlePassword = (e) => {
    if (accountValues.password.password == accountValues.password.reenter) {
      if (
        accountValues.password.password == undefined ||
        accountValues.password.password.length == 0
      ) {
        const newObj = { ...errors };
        newObj.password = {
          content: "Please enter new password",
          pointing: "below",
        };
        newObj.reenter = true;
        setErrors(newObj);
      } else {
        if (accountValues.password.current.length > 0) {
          const cred = firebase.auth.EmailAuthProvider.credential(
            userData.email,
            accountValues.password.current
          );
          setIsLoading((prevState) => {
            const newObj = { ...prevState };
            newObj.loading = true;
            newObj.progress = 0;
            return newObj;
          });
          userData
            .reauthenticateWithCredential(cred)
            .then(function () {
              userData
                .updatePassword(accountValues.password.password)
                .then(function () {
                  setSnackbarObj((prevState) => {
                    const newObj = { ...prevState };
                    newObj.isOpen = true;
                    newObj.content = "Password Changed";
                    return newObj;
                  });
                  setIsLoading((prevState) => {
                    const newObj = { ...prevState };
                    newObj.progress = 100;
                    return newObj;
                  });
                })
                .catch(function (error) {
                  setIsLoading((prevState) => {
                    const newObj = { ...prevState };
                    newObj.progress = 100;
                    return newObj;
                  });
                  setSnackbarObj((prevState) => {
                    const newObj = { ...prevState };
                    newObj.isOpen = true;
                    newObj.content =
                      "!!! Password change failed. Try again later !!!";
                    return newObj;
                  });
                });
            })
            .catch(function (error) {
              const newObj = { ...errors };
              newObj.current = {
                content: "Invalid Password",
                pointing: "below",
              };
              setErrors(newObj);
              setIsLoading((prevState) => {
                const newObj = { ...prevState };
                newObj.progress = 100;
                return newObj;
              });
            });
        } else {
          const newObj = { ...errors };
          newObj.current = {
            content: "Please enter current password",
            pointing: "below",
          };
          setErrors(newObj);
        }
      }
    } else {
      const newObj = { ...errors };
      newObj.password = {
        content: "Passwords Don't Match",
        pointing: "below",
      };
      newObj.reenter = true;
      setErrors(newObj);
    }
  };

  const handleChange = (e) => {
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

  const handleAction = (e, { name }) => {
    if (name == "cancel") {
      setOpen(false);
    } else {
      history.push("/logout");
    }
  };

  useEffect(() => {
    let progressTimer;
    if (isLoading.progress == 100) {
      progressTimer = setTimeout(() => {
        setIsLoading((prevState) => {
          const newObj = { ...prevState };
          newObj.loading = false;
          newObj.progress = 0;
          return newObj;
        });
      }, 500);
    }
    return () => {
      clearTimeout(progressTimer);
    };
  }, [isLoading]);
  return (
    <>
      {isLoading.loading && <PT_PROGRESS progress={isLoading.progress} />}

      <PT_MODAL
        isOpen={open}
        type="basic"
        content={{
          mainText: `${userInfo.nickname}, are you sure you want to logout?`,
        }}
        actionItems={["yes", "no"]}
        handleAction={handleAction}
      />
      <Set_Card title="Account" userData={userData} userInfo={userInfo} />

      {profile.providerId == "password" ? (
        <PT_CARD
        groupClass="settings-card-group"
          itemsPerRow={1}
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
              ),
            },
            {
              key: "logout",
              header: (
                <div onClick={() => setOpen(true)}>
                  <div className="set-nav-card">
                    <h2>Logout</h2>
                    <PT_ICON name="sign-out alternate" />
                  </div>
                </div>
              ),
            },
          ]}
          indiv={false}
          centered={true}
        />
      ) : (
        <>
          <PT_CARD
          groupClass="settings-card-group"
          itemsPerRow={1}
            cardArray={[
              {
                key: "change",
                header: `To change password, go change your password on Google`,
              },
              {
                key: "logout",
                header: (
                  <div onClick={() => setOpen(true)}>
                    <div className="set-nav-card">
                      <h2>Logout</h2>
                      <PT_ICON name="sign-out alternate" />
                    </div>
                  </div>
                ),
              },
            ]}
            indiv={false}
          />
        </>
      )}
    </>
  );
};

export default Set_Account;
