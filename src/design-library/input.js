import React, { useState } from "react";
import PT_INPUT from "../components/inputs/PT_INPUT";
import PT_TABLE from "../components/tables/PT_TABLE";
import { Form, Accordion, Icon } from "semantic-ui-react";

const InputDescription = ({ history }) => {
  const [exampleValue, setExampleValue] = useState({
    exampleTextarea: "type here",
    exampleInput: "type here"
  });
  const [activeIndex, setActiveIndex] = useState();

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };
  const handleChange = e => {
    let changeObj = { ...exampleValue };
    changeObj[e.target.id] = e.target.value;
    setExampleValue(changeObj);
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
                property: "placeholder",
                type: "string",
                description: "Text that when show when input is empty"
              },
              {
                property: "inputId",
                type: "string",
                description: "id for the input"
              },
              {
                property: "error (only on normal input)",
                type: "boolen or object",
                description: "Will show error on input"
              },
              {
                property: "icon",
                type: "string or object",
                description: "Adds icon to input"
              },
              {
                property: "type",
                type: "normal or textarea",
                description: "sets type of input"
              },
              {
                property: "handleChange",
                type: "function",
                description: "what happens when input changes"
              },
              {
                property: "valueFromState",
                type: "string or false [default: false]",
                description:
                  "This will determing the value of the input. Pass in variable changed in state."
              }
            ]}
          />
        </Accordion.Content>
      </Accordion>

      <hr />
      <h2>Standard Input</h2>
      <pre>
        {`
        <Form>
            <PT_INPUT
                placeholder="Search..."
                icon={{ name: "search", circular: true, link: true }}
            />
        </Form>  
    `}
      </pre>
      <Form>
        <PT_INPUT
          placeholder="Search..."
          icon={{ name: "search", circular: true, link: true }}
        />
      </Form>
      <hr />
      <h2>Input Updating State Button</h2>

      <pre>
        {`
        const [exampleValue, setExampleValue] = useState({
          exampleTextarea: ${exampleValue.exampleInput},
          exampleInput: ${exampleValue.exampleTextarea}
        }); 

        const handleChange = e => {
            let changeObj = { ...exampleValue };
            changeObj[e.target.id] = e.target.value;
            setExampleValue(changeObj);
        };

        <Form>
            <PT_INPUT
                icon={{ name: "search", circular: true, link: true }}
                valueFromState={exampleValue.exampleInput}
                inputId="exampleInput"
                handleChange={handleChange}
            />

            <br />

            <PT_INPUT
                type="textarea"
                inputId="exampleTextarea"
                handleChange={handleChange}
                valueFromState={exampleValue.exampleTextarea}
            />
        </Form>
        `}
      </pre>
      <h3>Type in the inputs below to see state change above</h3>
      <Form>
        <PT_INPUT
          icon={{ name: "search", circular: true, link: true }}
          valueFromState={exampleValue.exampleInput}
          inputId="exampleInput"
          handleChange={handleChange}
        />
        <br />
        <PT_INPUT
          type="textarea"
          inputId="exampleTextarea"
          handleChange={handleChange}
          valueFromState={exampleValue.exampleTextarea}
        />
      </Form>

      <hr />
      <h2>Error</h2>
      <pre>
        {`
            <Form>
            <PT_INPUT
              error={{ content: "Please enter your first name", pointing: "below" }}
              icon={{ name: "search", circular: true, link: true }}
              value={exampleValue.exampleInput}
              valueFromState={true}
              inputId="exampleInput"
              handleChange={handleChange}
            />
          </Form>
          `}
      </pre>
      <Form>
        <PT_INPUT
          error={{ content: "Please enter your first name", pointing: "below" }}
          icon={{ name: "search", circular: true, link: true }}
          value={exampleValue.exampleInput}
          valueFromState={true}
          inputId="exampleInput"
          handleChange={handleChange}
        />
      </Form>
    </>
  );
};

export default InputDescription;
