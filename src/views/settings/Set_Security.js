import React from "react";
import PT_CARD from "../../components/cards/PT_CARD";
import PT_ICON from "../../components/icons/PT_ICON";
import Set_Card from "../../components/cards/Set_Card";

const Set_Security = ({ userData, userInfo }) => {
  const handleSave = e => {
    console.log("save security");
  };

  return (
    <>
      <Set_Card
        title="Security"
        userData={userData}
        userInfo={userInfo}
        handleClick={handleSave}
      />
    </>
  );
};

export default Set_Security;
