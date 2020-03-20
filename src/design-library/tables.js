import React, { useState } from "react";
import PT_TABLE from "../components/tables/PT_TABLE";
import { Accordion, Icon } from "semantic-ui-react";
const TableDescription = ({ history }) => {
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
                property: "content",
                type: "array of objects",
                description:
                  "This will take the properties of the object to create the headers, then the rows will be build based on the values of each key value pair."
              },
              {
                property: "headers",
                type: "array of objects [optional]",
                description:
                  "This will rename the headers. If no headers are defined, the property name of the first array in the contenr header will be the header values."
              }
            ]}
            headers={["Property", "Type", "Description"]}
          />
        </Accordion.Content>
      </Accordion>

      <hr />
      <h2>With Header Property</h2>
      <pre>
        {`
          <PT_TABLE
          content={[
            {
              property: "content",
              type: "more content",
              description: "some content"
            }
          ]}
          headers={["Column1", "Column2", "Column3"]}
        />
          `}
      </pre>
      <PT_TABLE
        content={[
          {
            property: "content",
            type: "more content",
            description: "some content"
          }
        ]}
        headers={["Column1", "Column2", "Column3"]}
      />

      <hr />
      <h2>Without Header Property</h2>
      <pre>
        {`
          <PT_TABLE
          content={[
            {
              property: "content",
              type: "more content",
              description: "some content"
            }
          ]}
        />
          `}
      </pre>
      <PT_TABLE
        content={[
          {
            property: "content",
            type: "more content",
            description: "some content"
          }
        ]}
      />
    </>
  );
};

export default TableDescription;
