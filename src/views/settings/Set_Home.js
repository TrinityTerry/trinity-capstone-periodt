import React, { useState } from "react";
import PT_CARD from "../../components/cards/PT_CARD";
import PT_BUTTON from "../../components/buttons/PT_BUTTON";
import PT_CALENDAR from "../../components/calendar/PT_CALENDAR";
import PT_ICON from "../../components/icons/PT_ICON";
const Set_Home = ({ userData, userInfo }) => {
  const [card, setCard] = useState(["Profile", "Account", "Period & Cycle"]);
  return (
    <>
      <PT_CARD
        cardArray={card.map(item => {
          return {
            href: `/settings/${item.toLowerCase().split(" ").join("")}`,
            key: userData.uid + item.toLowerCase(),
            header: item
          };
        })}
        indiv={false}
        centered={true}
      />
    </>
  );
};

export default Set_Home;
