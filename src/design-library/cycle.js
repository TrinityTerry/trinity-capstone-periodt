import React from "react";
import PT_CYCLE from "../components/cycle/PT_CYCLE";
import PT_TABLE from "../components/tables/PT_TABLE";
import * as moment from "moment"

const CycleDescription = ({ history }) => {
  return (
    <>
      <PT_TABLE
        content={[
          {
            property: "handleClick",
            type: "function",
            description: "Function that will run on click."
          },
          {
            property: "content",
            type: "string",
            description: "text that will show on the button"
          }
        ]}
      />

      <PT_CYCLE cycleStart={moment("2020-01-17", "YYYY-MM-DD")} periodStart={moment("2020-02-11", "YYYY-MM-DD")} cycleEnd={moment("2020-02-14", "YYYY-MM-DD")}/>

      <pre>
        {`
          <PT_BUTTON
          handleClick={() => console.log("button Clicked")}
          content={"button example"}
          />      
        `}
      </pre>
    </>
  );
};

export default CycleDescription;
