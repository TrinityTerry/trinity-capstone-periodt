import React from "react";
import PT_CARD from "../cards/PT_CARD";
import PT_BUTTON from "../buttons/PT_BUTTON";
import PT_ICON from "../icons/PT_ICON";
import { Link } from "react-router-dom";

const Set_Card = ({ userInfo, userData, handleClick, title = "", path = "/settings" }) => {
  return (
    <PT_CARD
      cardArray={[
        {
          key: userData.uid + "settings",
          header: (
            <div className="set-back-card">
            <Link to={path}>
              <PT_ICON name="angle left" />
              
            </Link>
            <h2>{title}</h2>
            <div className="set-empty-space"></div>
            </div>
          ),
        }
      ]}
      indiv={false}
      centered={true}
    />
  );
};

export default Set_Card;
