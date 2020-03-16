import React, { useState } from "react";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_TABLE from "../components/tables/PT_TABLE";
import { Accordion, Icon } from "semantic-ui-react";


const ButtonDescription = ({ history }) => {
  const [activeIndex, setActiveIndex] = useState();

  const handleClick = (e, titleProps) => {
    console.log(titleProps);

    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };
  return (
    <>
    <hr/>
         <Accordion styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleClick}
        >
          <Icon name="dropdown" />
          Props
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
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
        </Accordion.Content>
      </Accordion>
      

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

  <h2>Button with Icon</h2>

  <pre>
    {`
      <PT_BUTTON
        icon={'sign out alternate'}
        handleClick={() => console.log("circle button clicked")}
        circular={true}
         />     
    `}
  </pre>

    <PT_BUTTON
      icon={'sign out alternate'}
      handleClick={() => console.log("circle button clicked")}
      circular={true}
    />

     
    </>
  );
};

export default ButtonDescription;
