import React from "react";
import PT_CARD from "../cards/PT_CARD";
import PT_BUTTON from "../buttons/PT_BUTTON";
import PT_ICON from "../icons/PT_ICON";
import { Link } from "react-router-dom";

const Set_Card = ({ userInfo, userData, handleClick, title = "" }) => {
  return (
    <PT_CARD
      cardArray={[
        {
          key: userData.uid + "settings",
          header: (
            <Link to="/settings">
              <PT_ICON name="angle left" />
              Go Back
            </Link>
          ),
          meta: <> {title} </>
        }
      ]}
      indiv={false}
      centered={true}
    />
  );
};

export default Set_Card;
