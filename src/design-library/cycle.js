import React, { useState } from "react";
import PT_CYCLE from "../components/cycle/PT_CYCLE";
import PT_TABLE from "../components/tables/PT_TABLE";
import * as moment from "moment";
import { Accordion, Icon } from "semantic-ui-react";

const CycleDescription = ({ history }) => {
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
                property: "cycleStart",
                type: "full moment obj [required]",
                description: "The date that the cycle started"
              },
              {
                property: "predictedPeriodStart",
                type: "full moment obj [required]",
                description: "Date of predicted period"
              },
              {
                property: "predictedCycleEnd",
                type: "full moment obj [required]",
                description: "Date that cycle is predicted to end"
              },
              {
                property: "showDate",
                type: "boolean [default is true]",
                description:
                  "If value is false, the current date will be hidden"
              },
              {
                property: "showPeriod",
                type: "boolean [default is true]",
                description:
                  "If value is false, the period start date will be hidden"
              },
              {
                property: "dots",
                type: "string",
                description:
                  "'normal': will show the dots the normal size, 'small': will show the dots at the smaller size"
              }
            ]}
          />
        </Accordion.Content>
      </Accordion>

      <hr />
      <p>
        If the cycle days are more than 29, the dots will automatically be
        small.
      </p>
      <hr />

      <h2>Default</h2>
      <PT_CYCLE
        cycleStart={moment().startOf("month")}
        predictedPeriodStart={moment(29, "DD")}
        predictedCycleEnd={moment().endOf("month")}
      />

      <pre>
        {`
          <PT_CYCLE 
            cycleStart={moment().startOf('month')} 
            predictedPeriodStart={moment(29, "DD")} 
            predictedCycleEnd={moment().endOf('month')}
          />   
        `}
      </pre>

      <hr />
      <h2>Small Dots</h2>
      <PT_CYCLE
        cycleStart={moment().startOf("month")}
        predictedPeriodStart={moment(29, "DD")}
        predictedCycleEnd={moment().endOf("month")}
        dots="small"
      />

      <pre>
        {`
          <PT_CYCLE 
            cycleStart={moment().startOf('month')} 
            predictedPeriodStart={moment(29, "DD")} 
            predictedCycleEnd={moment().endOf('month')}
            dots="small"
        />     
        `}
      </pre>

      <hr />
      <h2>No Date, Period days</h2>

      <PT_CYCLE
        cycleStart={moment().startOf("month")}
        predictedPeriodStart={moment(29, "DD")}
        predictedCycleEnd={moment().endOf("month")}
        showDate={false}
        showPeriod={false}
      />

      <pre>
        {`
          <PT_CYCLE 
            cycleStart={moment().startOf('month')} 
            predictedPeriodStart={moment(29, "DD")} 
            predictedCycleEnd={moment().endOf('month')}
            showDate={false}
            showPeriod={false}
         />   
        `}
      </pre>
    </>
  );
};

export default CycleDescription;
