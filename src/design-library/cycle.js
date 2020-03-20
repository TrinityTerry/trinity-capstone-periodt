import React, { useState } from "react";
import PT_CYCLE from "../components/cycle/PT_CYCLE";
import PT_TABLE from "../components/tables/PT_TABLE";
import * as moment from "moment";
import { Accordion, Icon } from "semantic-ui-react";

const CycleDescription = ({ history }) => {
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
                property: "periodStart",
                required: "required",
                default:"",
                type: "full moment obj",
                description: "Date last period started",
                
              },
              {
                property: "periodEnd",
                type: "full moment obj [required]",
                description: "Day period predicted to end",
                required: "required",
              },
              {
                property: "predictedCycleEnd",
                type: "full moment obj [required]",
                description: "Date that cycle is predicted to end",
                required: "required",
              },
              {
                property: "averageCycleLength",
                type: "boolean [default is true]",
                description:
                  "If value is false, the current date will be hidden",
                  required: "required",
              },
              {
                property: "middleMonths",
                type: "boolean [default is true]",
                description:
                  "If value is false, the period start date will be hidden",
                  required: "required",
              },
              {
                property: "nextPeriod",
                type: "boolean [default is true]",
                description:
                  "If value is false, the period start date will be hidden",
                  required: "required",
              },
              {
                property: "dots",
                type: "string",
                description:
                 "'normal': will show the dots the normal size, 'small': will show the dots at the smaller size",
                  required: "",
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
      <pre>
        {`
          <PT_CYCLE
            periodStart={[STARTOFPERIOD]}
            periodEnd={[DAYPERIODENDS]}
            predictedCycleEnd={[PREDICTEDCYCLEEND]}
            averageCycleLength={[AVERAGECYCLE]}
            middleMonths={[PREDICTEDCYCLEEND_PROP].diff([PERIODSTART_PROP], "months", true)}
            nextPeriod={[PREDICTEDCYCLEEND_PROP].add(1, "days").calendar()}
          />
        `}
      </pre>

      <PT_CYCLE
        periodStart={moment().startOf("month")}
        periodEnd={moment(5, "DD")}
        predictedCycleEnd={moment().add(1, "months").endOf("month")}
        averageCycleLength={50}
        middleMonths={moment().add(1, "months").endOf("month").diff(moment().startOf("month"), "months", true)}
        nextPeriod={moment().add(1, "months").endOf("month").add(1, "days").calendar()}
      />


       {/* <hr />
      <h2>Small Dots</h2>
      <pre>
        {`
          <PT_CYCLE
            periodStart={moment().startOf("month")}
            periodEnd={moment(5, "DD")}
            predictedCycleEnd={moment().endOf("month")}
            averageCycleLength={39}
            dots="small"
          />     
        `}
      </pre>
      
      <PT_CYCLE
        periodStart={moment().startOf("month")}
        cycleMonth={moment().startOf("month").add(1, "months")}
        periodEnd={moment(5, "DD")}
        predictedCycleEnd={moment().endOf("month")}
        averageCycleLength={39}
        middleMonths={moment().endOf("month").diff(moment().startOf("month"), "months", true)}
        nextPeriod={moment().endOf("month").add(1, "days").calendar()}
        dots="small"
      />


      <hr />
      <h2>No Date, Period days</h2>
      <PT_CYCLE
        periodStart={moment().startOf("month")}
        cycleMonth={moment().startOf("month").add(1, "months")}
        periodEnd={moment(5, "DD")}
        predictedCycleEnd={moment().endOf("month")}
        averageCycleLength={39}
        middleMonths={moment().endOf("month").diff(moment().startOf("month"), "months", true)}
        nextPeriod={moment().endOf("month").add(1, "days").calendar()}
        showDate={false}
        showPeriod={false}
      />

      <pre>
        {`
          <PT_CYCLE
            periodStart={moment().startOf("month")}
            periodEnd={moment(5, "DD")}
            predictedCycleEnd={moment().endOf("month")}
            averageCycleLength={39}
            showDate={false}
            showPeriod={false}
          /> 
        `}
      </pre>  */}
    </>
  );
};

export default CycleDescription;
