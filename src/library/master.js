import React, { useEffect, useState } from "react";
import MenuDescription from "./description-components/menus";
import PT_MENU from "./menus/PT_Menu";
import ButtonDescription from "./description-components/buttons"
import CalendarDescription from "./description-components/calendar"
// import

const DLMaster = ({ pages, userInfo, history, page, match }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    match.params.element === "home" && setContent(<div>Welcome To Periodt's Design Library!</div>);
    match.params.element === "buttons" && setContent(<ButtonDescription />);
    match.params.element === "calendar" && setContent(<CalendarDescription />);
    match.params.element === "menus" && setContent(<MenuDescription history={history} />);
  }, [match]);

  return (
    <>
      <PT_MENU
        page={page}
        path={"/dl"}
        links={pages}
        type={"tabs"}
      />
      {content}
    </>
  );
};

export default DLMaster;
