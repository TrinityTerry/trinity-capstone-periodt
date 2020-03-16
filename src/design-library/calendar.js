import React, { useState } from "react";
import PT_CALENDAR from "../components/calendar/PT_CALENDAR";
import PT_TABLE from "../components/tables/PT_TABLE";
import { Accordion, Icon } from "semantic-ui-react";


const CalendarDescription = ({ history }) => {
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
              property: "date",
              type: "string",
              description: "'YYYY-MM' TO determine what month to create"
            },
            {
              property: "highlight",
              type: "array of number strings",
              description: "Takes a string of numbers and those corrosponding days will be hilighted"
            }
          ]}
        />
        </Accordion.Content>
      </Accordion>
    

      <pre>
        {`
          <PT_CALENDAR date={"2020-03"} highlight={["9", "10", "11"]}/>
          `}
      </pre>
      <PT_CALENDAR date={"2020-03"} highlight={["9", "10", "11"]} />

      <hr />

      <pre>
        {`
          <PT_CALENDAR date={"2020-02"} highlight={["9", "10", "11"]}/>
          `}
      </pre>
      <PT_CALENDAR date={"2020-02"} highlight={["9", "10", "11"]} />
      
      <hr />

      <pre>
        {`
          <PT_CALENDAR date={"2020-05"} highlight={["9", "10", "11"]}/>
          `}
      </pre>
      <PT_CALENDAR date={"2020-05"} highlight={["9", "10", "11"]} />
      
      <hr />

      <pre>
        {`
          <PT_CALENDAR date={"2020-06"} highlight={["9", "10", "11"]}/>
          `}
      </pre>
      <PT_CALENDAR date={"2020-06"} highlight={["9", "10", "11"]} />
    </>
  );
};

export default CalendarDescription;
