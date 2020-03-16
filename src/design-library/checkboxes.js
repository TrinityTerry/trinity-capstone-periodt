import React, { useState } from "react";
import PT_TABLE from "../components/tables/PT_TABLE";
import PT_CHECKBOX from "../components/checkboxes/PT_CHECKBOX";
import { Card, Accordion, Icon } from "semantic-ui-react";

const CheckboxesDescription = ({ history }) => {
  const [activeIndex, setActiveIndex] = useState();
  const [checkboxValues, setCheckboxValues] = useState({exampleCheck: false, anotherCheck: false});

  const handleClick = (e, titleProps) => {
    console.log(titleProps);

    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const getValue = (value, id) => {
    const newObj = { ...checkboxValues };
    newObj[id] = value;
    setCheckboxValues(newObj);
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
                property: "getValue",
                type: "function",
                description: "[required to get value] passes up value of checkbox"
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
        const [checkboxValues, setCheckboxValues] = useState(
            {
                exampleCheck: ${checkboxValues.exampleCheck},   
                anotherCheck: ${checkboxValues.anotherCheck}
            }
        );

        const getValue = (value, id) => {
            const newObj = { ...checkboxValues };
            newObj[id] = value;
            setCheckboxValues(newObj);
        };

         <PT_CHECKBOX getValue={getValue} checkId="exampleCheck"/>
         <PT_CHECKBOX getValue={getValue} checkId="anotherCheck"/>

        `}
      </pre>

      <PT_CHECKBOX getValue={getValue} checkId="exampleCheck" />
      <PT_CHECKBOX getValue={getValue} checkId="anotherCheck" />
    </>
  );
};

export default CheckboxesDescription;
