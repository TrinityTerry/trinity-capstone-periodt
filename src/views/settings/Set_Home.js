import React from "react";
import PT_CARD from "../../components/cards/PT_CARD";
import PT_BUTTON from "../../components/buttons/PT_BUTTON";
import PT_CALENDAR from "../../components/calendar/PT_CALENDAR";
import PT_ICON from "../../components/icons/PT_ICON";
const Set_Home = ({ userData, userInfo }) => {
  return (
    <>
      <PT_CARD
        cardArray={[
          {
            href: "/settings/profile",
            key: userData.uid + "profile",
            header: "Profile",
            
          },
          {
            href: "/settings/account",
            key: userData.uid + "account",
            header: "Account"
          },
          // {
          //   href: "/settings/security",
          //   key: userData.uid + "security",
          //   header: "Security"
          // },
          // {
          //   href: "/settings/notifications",
          //   key: userData.uid + "notification",
          //   header: "Notifications"
          // }
        ]}
        indiv={false}
        centered={true}
      />
    </>
  );
};

export default Set_Home;
