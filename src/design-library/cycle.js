import React from "react";
import PT_CYCLE from "../components/cycle/PT_CYCLE";
import PT_TABLE from "../components/tables/PT_TABLE";
import * as moment from "moment"

const CycleDescription = ({ history }) => {
  console.log(moment().startOf('month').format("YYYY-MM-DD"));
  console.log(moment(29, "DD").format("YYYY-MM-DD"));
  console.log(moment().endOf('month').format("YYYY-MM-DD"));
  // console.log(moment("2020-04-04", "YYYY-MM-DD").format("YYYY-MM-DD"));
  
  return (
    <>
    
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
            description: "If value is false, the current date will be hidden"
          },
          {
            property: "showPeriod",
            type: "boolean [default is true]",
            description: "If value is false, the period start date will be hidden"
          },
          {
            property: "dots",
            type: "string",
            description: "'normal': will show the dots the normal size, 'small': will show the dots at the smaller size"
          }
        ]}
      />
<hr />
<p>If the cycle days are more than 29, the dots will automatically be small.</p>
<hr />

<h2>Default</h2>
      <PT_CYCLE 
        cycleStart={moment().startOf('month')} 
        predictedPeriodStart={moment(29, "DD")} 
        predictedCycleEnd={moment().endOf('month')}
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
          cycleStart={moment().startOf('month')} 
          predictedPeriodStart={moment(29, "DD")} 
          predictedCycleEnd={moment().endOf('month')}
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
         cycleStart={moment().startOf('month')} 
         predictedPeriodStart={moment(29, "DD")} 
         predictedCycleEnd={moment().endOf('month')}
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
