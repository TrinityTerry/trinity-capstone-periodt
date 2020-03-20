import React, { useState } from "react";
import PT_TABLE from "../components/tables/PT_TABLE";
import PT_MODAL from "../components/modals/PT_MODAL";
import { Card, Accordion, Icon } from "semantic-ui-react";

const ModalDescription = ({ history }) => {
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
                property: "trigger",
                required: "",
                default: "",
                type: "node",
                description: "node that will be created to open modal"
              },
              {
                property: "type",
                type: "enum",
                description: "normal or basic",
                required: "",
                default: ""
              },
              {
                property: "content",
                type: "object",
                description: "object used to populate modal",
                required: "",
                default: ""
              },
              {
                property: "actionItems",
                type: "array",
                required: "",
                default: "",
                description: "used to create buttons"
              },
              {
                property: "size",
                type: "strimg",
                required: "",
                default: "",
                description: "size of modal"
              },
              {
                property: "isOpen",
                type: "boolean",
                required: "",
                default: "",
                description: "sets modal open to frue or false"
              },
              {
                property: "handleAction",
                type: "function",
                required: "",
                default: "",
                description: "what happens on click of action button"
              }
            ]}
          />
        </Accordion.Content>
      </Accordion>

      <p>1. Cards are stackable</p>
      <hr />
      <h2>Single Card </h2>
      <pre>
      </pre>
      <PT_MODAL
        trigger={<button>Normal Modal</button>}
        content={{
          modalHeader: "header",
          descriptionHeader: "desc header",
          mainText: "this is the main text"
        }}
        actionItems={["cancel", "submit"]}
      />
      <PT_MODAL
        trigger={<button>Basic Modal</button>}
        content={{
          modalHeader: "header",

          descriptionHeader: "desc header",
          mainText: "this is the main text"
        }}
        actionItems={["cancel", "submit"]}
        type="basic"
      />
    </>
  );
};

export default ModalDescription;
