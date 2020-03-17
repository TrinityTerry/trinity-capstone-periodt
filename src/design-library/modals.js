import React, { useState } from "react";
import PT_TABLE from "../components/tables/PT_TABLE";
import PT_MODAL from "../components/modals/PT_MODAL";
import { Card, Accordion, Icon } from "semantic-ui-react";

const ModalDescription = ({ history }) => {
  const [activeIndex, setActiveIndex] = useState();

  const handleClick = (e, titleProps) => {
    console.log(titleProps);
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  return (
    <>
      <PT_MODAL
        trigger={<button>Normal Modal</button>}
        content={{
          modalHeader: "header",
          image: {
            // src: "https://react.semantic-ui.com/images/avatar/large/rachel.png",
            // size: "medium"
          },
          descriptionHeader: "desc header",
          mainText: "this is the main text"
        }}
        actionItems={["cancel", "submit"]}
      />
      <PT_MODAL
        trigger={<button>Basic Modal</button>}
        content={{
          modalHeader: "header",
          image: {
            // src: "https://react.semantic-ui.com/images/avatar/large/rachel.png",
            // size: "medium"
          },
          descriptionHeader: "desc header",
          mainText: "this is the main text"
        }}
        actionItems={["cancel", "submit"]}
        type="basic"
      />
      <PT_MODAL
        trigger={<button>Long Modal</button>}
        content={{
          modalHeader: "header",
          image: {
            // src: "https://react.semantic-ui.com/images/avatar/large/rachel.png",
            // size: "medium"
          },
          descriptionHeader: "desc header",
          mainText: "this is the main text"
        }}
        type="long"
      />
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
                property: "getValue",
                type: "function",
                description:
                  "[required to get value] passes up value of checkbox"
              },
              {
                property: "checkId",
                type: "string",
                description: "[required to get value] id of checkbox"
              }
            ]}
          />
        </Accordion.Content>
      </Accordion>

      <p>1. Cards are stackable</p>
      <hr />
      <h2>Single Card </h2>
      <pre>
        {`
        

        const getValue = (value, id) => {
            const newObj = { ...checkboxValues };
            newObj[id] = value;
            setCheckboxValues(newObj);
        };

         <PT_CHECKBOX getValue={getValue} checkId="exampleCheck"/>
         <PT_CHECKBOX getValue={getValue} checkId="anotherCheck"/>

        `}
      </pre>
    </>
  );
};

export default ModalDescription;
