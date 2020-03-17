import React, { useState } from "react";
import PT_TABLE from "../components/tables/PT_TABLE";
import PT_CARD from "../components/cards/PT_CARD";
import { Accordion, Icon } from "semantic-ui-react";

const CardDescription = ({ history }) => {
  const [activeIndex, setActiveIndex] = useState();

  const handleClick = (e, titleProps) => {
    console.log(titleProps);

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
                property: "cardArray",
                type: "array of objects",
                description: "holds all content that will go in the card"
              },
              {
                property: "itemsPerRow",
                type: "number",
                description: "how many cards will be on a row"
              },
              {
                property: "groupClass",
                type: "string",
                description: "Class name to be assigned to gard group"
              }
            ]}
          />
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={handleClick}
        >
          <Icon name="dropdown" />
          cardArray props (From{" "}
          <a href="https://react.semantic-ui.com/views/card/">
            Semantic UI React
          </a>
          )
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <PT_TABLE
            content={[
              {
                property: "centered",
                type: "bool",
                description: "A Card can center itself inside its container."
              },
              {
                property: "children",
                type: "node",
                description: "Primary content."
              },
              {
                property: "className",
                type: "string",
                description: "Additional classes"
              },
              {
                property: "color",
                type: "enum",
                description:
                  "red, orange, yellow, olive, green, teal, blue, violet, purple, pink, brown, grey, black"
              },
              {
                property: "content",
                type: "custom",
                description: "Shorthand for primary content."
              },
              {
                property: "description",
                type: "custom",
                description: "Shorthand for CardDescription."
              },
              {
                property: "extra",
                type: "custom",
                description: "Shorthand for primary content of CardContent."
              },
              {
                property: "fluid",
                type: "bool",
                description:
                  "A Card can be formatted to take up the width of its container."
              },
              {
                property: "header",
                type: "custom",
                description: "Shorthand for CardHeader."
              },
              {
                property: "href",
                type: "strimg",
                description:
                  "Render as an `a` tag instead of a `div` and adds the href attribute."
              },
              {
                property: "image",
                type: "custom",
                description: "A card can contain an Image component."
              },
              {
                property: "link",
                type: "bool",
                description: "A card can be formatted to link to other content."
              },
              {
                property: "meta",
                type: "custom",
                description: "Shorthand for CardMeta."
              },
              {
                property: "onClick",
                type: "func",
                description:
                  "Called on click. When passed, the component renders as an 'a'tag by default instead of a `div`. onClick(event: SyntheticEvent, data: object)"
              },
              {
                property: "raised",
                type: "bool",
                description: "A Card can be formatted to raise above the page."
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
         <PT_CARD
         cardArray={[
           {
             centered: true,
             link: "#card-example-link-card",
             image:
               "https://react.semantic-ui.com/images/wireframe/white-image.png"
           }
         ]}
       />

    `}
      </pre>

      <PT_CARD
        cardArray={[
          {
            centered: true,
            link: "#card-example-link-card",
            image:
              "https://react.semantic-ui.com/images/wireframe/white-image.png"
          }
        ]}
      />

      <hr />
      <h2>Group of Cards </h2>
      <pre>
        {`
        <PT_CARD
          cardArray={[
            {
              centered: true,
              color: "blue",
              extra: "click me to go to google",

              link: "#card-example-link-card",
              image:
                "https://react.semantic-ui.com/images/wireframe/white-image.png"
            },
            {
              header: "New",
              image:
                "https://react.semantic-ui.com/images/avatar/large/matthew.png"
            },
            {
              description:
                "Leverage agile frameworks to provide a robust synopsis for high level overviews.",
              image:
                "https://react.semantic-ui.com/images/avatar/large/elliot.jpg"
            },
            {
              header: "New",
              href: "#card-example-link-card",
              description:
                "Leverage agile frameworks to provide a robust synopsis for high level overviews."
            }
          ]}
          itemsPerRow={2}
        />
    
      `}
      </pre>

      <PT_CARD
        cardArray={[
          {
            centered: true,
            color: "blue",
            extra: "click me to go to google",

            link: "#card-example-link-card",
            image:
              "https://react.semantic-ui.com/images/wireframe/white-image.png"
          },
          {
            header: "New",
            image:
              "https://react.semantic-ui.com/images/avatar/large/matthew.png"
          },
          {
            description:
              "Leverage agile frameworks to provide a robust synopsis for high level overviews.",
            image:
              "https://react.semantic-ui.com/images/avatar/large/elliot.jpg"
          },
          {
            header: "New",
            href: "#card-example-link-card",
            description:
              "Leverage agile frameworks to provide a robust synopsis for high level overviews."
          }
        ]}
        itemsPerRow={2}
      />
    </>
  );
};

export default CardDescription;
