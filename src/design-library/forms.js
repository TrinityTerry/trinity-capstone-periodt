import React, { useState } from "react";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_TABLE from "../components/tables/PT_TABLE";
import { Accordion, Icon } from "semantic-ui-react";


const FormDescription = ({ history }) => {
  const [activeIndex, setActiveIndex] = useState();

  const handleClick = (e, titleProps) => {

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
            required: "",
            default: "",
            type: "function",
            description: "Function that will run on click."
          },
          {
            property: "content",
            required: "",
            default: "",
            type: "string",
            description: "text that will show on the button"
          },
          {
            property: "basic",
            required: "",
            default: "false",
            type: "boolen",
            description: "Button type"
          },
          {
            property: "icon",
            type: "string",
            default: "",
            description: "name of icon",
            required: "",
          }
          ,
          {
            property: "iconPosition",
            required: "",
            type: "right or left",
            description: "indicates position of the icon on the button",
            default: "",
          }
          ,
          {
            property: "inverted",
            type: "boolean",
            required: "",
            description: "inverts colors of button",
            default: "false",
          }
          ,
          {
            property: "circular",
            type: "boolean",
            description: "make button circular",
            required: "",
            default: "false",
          }
        ]}
      />
        </Accordion.Content>
      </Accordion>
    </>
  );
};

export default FormDescription;
