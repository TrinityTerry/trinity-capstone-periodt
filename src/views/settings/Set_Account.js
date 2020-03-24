import React from "react";
import PT_CARD from "../../components/cards/PT_CARD";
import PT_ICON from "../../components/icons/PT_ICON";
const Set_Account = ({ userData, userInfo }) => {
  return (
    <>
      <PT_CARD
        cardArray={[
          {
            href: "/settings",
            key: userData.uid + "settings",
            header: "Go Back",
            
          }
        ]}
        indiv={false}
        centered={true}
      />
    </>
  );
};

export default Set_Account;