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
          },
          {
            property: "basic",
            type: "boolen",
            description: "Button type"
          },
          {
            property: "icon",
            type: "string",
            description: "name of icon"
          }
          ,
          {
            property: "iconPosition",
            type: "right or left",
            description: "indicates position of the icon on the button"
          }
        ]}
      />

<hr />
<h2>Standard Button</h2>
  <pre>
    {`
      <PT_BUTTON
        handleClick={() => console.log("button clicked")}
        content={"button example"}
        basic={true}
      />     
    `}
  </pre>

  <PT_BUTTON
    handleClick={() => console.log("button clicked")}
    content={"button example"}
    basic={true}
  />

<hr />

<h2>Basic and Inverted Button</h2>

  <pre>
    {`
      <PT_BUTTON
        handleClick={() => console.log("Basic inverted button clicked")}
        content={"button example"}
        inverted={true}
        basic={true}
      />     
    `}
  </pre>

  <div className="button-inverted">
    <PT_BUTTON
      handleClick={() => console.log("Basic inverted button clicked")}
      content={"button example"}
      inverted={true}
      basic={true}
    />
  </div>

<hr />
<h2>Basic Button</h2>

  <pre>
    {`
      <PT_BUTTON
        handleClick={() => console.log("inverted button clicked")}
        content={"button example"}
        inverted={true}
      />     
    `}
  </pre>

  <div className="button-inverted">
    <PT_BUTTON
      handleClick={() => console.log("inverted button clicked")}
      content={"button example"}
      inverted={true}
    />
  </div>

<h2>Button with Icon</h2>

  <pre>
    {`
      <PT_BUTTON
        handleClick={() => console.log("inverted button clicked")}
        content={"button example"}
        inverted={true}
      />     
    `}
  </pre>

  <div className="button-inverted">
    <PT_BUTTON
      icon={'sign out alternate'}
      iconPosition="right"
      handleClick={() => console.log("inverted button clicked")}
      content={"button example"}
      inverted={true}
    />
  </div>

     
    </>
  );
};

export default ButtonDescription;
