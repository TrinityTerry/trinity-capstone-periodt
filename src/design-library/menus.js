import React, { useState } from "react";
import PT_MENU from "../components/menus/PT_MENU";
import PT_TABLE from "../components/tables/PT_TABLE";
import { Accordion, Icon } from "semantic-ui-react";


const MenuDescription = ({ history }) => {
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
            property: "title [optional]",
            type: "string",
            description:
              "This is the title that will show up on the Left side of the navbar"
          },
          {
            property: "page",
            type: "string",
            description:
              "match.params accociated with the page that will show then the navlink is clicked"
          },
          {
            property: "path",
            type: "string",
            description: "Path to start with when routing using navlink"
          },
          {
            property: "links",
            type: "array of strings",
            description:
              "array to build links. Each string will be determine the path and title of the link"
          },
          {
            property: "type",
            type: "string",
            description: "'tab': Tabular Menu; 'navbar': responsive navbar"
          },
          {
            property: "element [optional]",
            type: "JSX node",
            description: "This will be placed on the right side of the navbar"
          }
        ]}
      />
        </Accordion.Content>
      </Accordion>
      

      <PT_MENU page={"tab"} path={"/dl"} links={["tab"]} type={"tabs"} />

      <pre>
        {`
          <PT_MENU
            title={"Title"}
            page={page}
            path={"/dl"}
            links={pages}
            type={"tabs"}
          />
          `}
      </pre>

      <hr />
      <PT_MENU
        title={"Title"}
        page={"tab"}
        path={"/dl"}
        links={["tab", "another tab"]}
        type={"navbar"}
      />

      <pre>
        {`
          <PT_MENU
          title={"Title"}
          page={"tab"}
          path={"/dl"}
          links={["tab", "another tab"]}
          type={"navbar"}
        />
          `}
      </pre>
    </>
  );
};

export default MenuDescription;
