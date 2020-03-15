import React from "react";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_TABLE from "../components/tables/PT_TABLE";

const ButtonDescription = ({ history }) => {
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

      <PT_BUTTON
        handleClick={() => console.log("button Clicked")}
        content={"button example"}
      />

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

export default ButtonDescription;
