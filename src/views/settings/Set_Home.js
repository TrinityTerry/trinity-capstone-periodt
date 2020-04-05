import React, { useState } from "react";
import PT_CARD from "../../components/cards/PT_CARD";
import PT_BUTTON from "../../components/buttons/PT_BUTTON";
import PT_CALENDAR from "../../components/calendar/PT_CALENDAR";
import PT_ICON from "../../components/icons/PT_ICON";
import {Link} from "react-router-dom"
const Set_Home = ({ userData, userInfo }) => {
  const [card, setCard] = useState([
    "Account",
    "Profile",
    "Period & Cycle",
    "Log History",
    "About PeriodT"
  ]);
  return (
    <>
      <PT_CARD
        cardArray={card.map(item => {
          if (item == "Logout") {
            return {
              key: "logout",
              header: <Link to={`/logout`}>
            <div className="set-nav-card">
            <h2>Logout</h2>
              <PT_ICON name="sign-out alternate" />
              
            </div>
            </Link>
            };
          }
          return {
            
            key: userData.uid + item.toLowerCase(),
            header: (
            <Link to={`/settings/${item
              .toLowerCase()
              .split(" ")
              .join("")}`}>
            <div className="set-nav-card">
            <h2>{item}</h2>
              <PT_ICON name="angle right" />
              
            </div>
            </Link>
          ),
          };
        })}
        itemsPerRow={1}
        indiv={false}
        centered={true}
      />
    </>
  );
};

export default Set_Home;
