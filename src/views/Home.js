import React, { useEffect, useState } from "react";
import APIManager from "../api-manager/APIManager";
import PT_MODAL from "../components/modals/PT_MODAL";
import PT_INPUT from "../components/inputs/PT_INPUT";
import UpdateUserForm from "../components/forms/updateUser";
import { Form } from "semantic-ui-react";

import "firebase/database";

const Home = ({
  userData,
  userInfo,
  refreshUser,
  logout,
  getMissingInfo,
  missingUserInfo
}) => {
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (userInfo !== null) {
      if (!userInfo) {
        APIManager.createNewUser(userData.uid).then(refreshUser());
      }
    }

    getMissingInfo();
  }, [userInfo]);

  useEffect(() => {
    if (missingUserInfo.length > 0) {
      setOpenModal(true);
    }
  }, [missingUserInfo]);

  const passInfo = info => {
    setOpenModal(false);
    APIManager.updateUser(info, userData.uid).then(refreshUser());
  };

  return (
    <>
      <input type="text"></input>
      <PT_MODAL
        content={{
          modalHeader: "Update Account",
          descriptionHeader: "Update account information to continue",
          mainText: (
            <UpdateUserForm
              passInfo={passInfo}
              missingUserInfo={missingUserInfo}
            />
          )
        }}
        isOpen={openModal}
        actionItems={["cancel"]}
        handleAction={() => {
          logout();
        }}
      />
    </>
  );
};

export default Home;
// "Fri, 13 Mar 2020 21:36:37 GMT"
