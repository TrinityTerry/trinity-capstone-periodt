import React, { useEffect, useState } from "react";
import MenuDescription from "../design-library/menus";
import PT_MENU from "./menus/PT_MENU";
import ButtonDescription from "../design-library/buttons"
import CalendarDescription from "../design-library/calendar"
import TableDescription from "../design-library/tables"
import CycleDescription from "../design-library/cycle"
// import

const DLMaster = ({ pages, userInfo, history, page, match }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    match.params.element === "home" && setContent(<div>Welcome To Periodt's Design Library!</div>);
    match.params.element === "buttons" && setContent(<ButtonDescription />);
    match.params.element === "calendar" && setContent(<CalendarDescription />);
    match.params.element === "menus" && setContent(<MenuDescription history={history} />);
    match.params.element === "table" && setContent(<TableDescription history={history} />);
    match.params.element === "cycle" && setContent(<CycleDescription history={history} />);
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
