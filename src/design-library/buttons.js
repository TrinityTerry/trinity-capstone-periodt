import React, { useState } from "react";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_FLOAT_BUTTON from "../components/buttons/PT_FLOAT_BUTTON";
import PT_PERIODSTART from "../components/buttons/PT_PERIODSTART";
import PT_TABLE from "../components/tables/PT_TABLE";
import { Accordion, Icon } from "semantic-ui-react";

const ButtonDescription = ({ history }) => {
  const [activeIndex, setActiveIndex] = useState();

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };
  return (
    <>
      <hr />
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
                required: "",
                default: "",
                type: "function",
                description: "Function that will run on click.",
              },
              {
                property: "content",
                required: "",
                default: "",
                type: "string",
                description: "text that will show on the button",
              },
              {
                property: "basic",
                required: "",
                default: "false",
                type: "boolen",
                description: "Button type",
              },
              {
                property: "icon",
                type: "string",
                default: "",
                description: "name of icon",
                required: "",
              },
              {
                property: "iconPosition",
                required: "",
                type: "right or left",
                description: "indicates position of the icon on the button",
                default: "",
              },
              {
                property: "inverted",
                type: "boolean",
                required: "",
                description: "inverts colors of button",
                default: "false",
              },
              {
                property: "circular",
                type: "boolean",
                description: "make button circular",
                required: "",
                default: "false",
              },
            ]}
          />
        </Accordion.Content>
      </Accordion>

      <h2>Basic Button</h2>

      <pre>
        {`
    <PT_BUTTON
    icon={'sign out alternate'}
    handleClick={() => console.log("inverted button clicked")}
    content={"button example"}
    iconPosition="left"
    />    
    `}
      </pre>
      <PT_BUTTON
        disabled={false}
        active={false}
        value="basic button value"
        name="basic button name"
        basic={true}
        buttonClass="button-class"
        inverted={false}
        size="large"
        circular={true}
        id="button-id"
        handleMouseEnter={() => {
          console.log("Mouse entered");
        }}
        handleMouseLeave={() => {
          console.log("Mouse left");
        }}
        loading={false}
        compact={false}
        icon={"sign out alternate"}
        handleClick={() => console.log("inverted button clicked")}
        content={"button example"}
        iconPosition="left"
      />

      <h2>Floating Button</h2>
      <PT_FLOAT_BUTTON
        handleClick={() => console.log("inverted button clicked")}
        content={"button example"}
      />
      
      <h2>Period Start Button</h2>

      <PT_PERIODSTART
        icon={"sign out alternate"}
        handleClick={() => console.log("inverted button clicked")}
        content={"button example"}
        iconPosition="left"
      />
    </>
  );
};

export default ButtonDescription;
