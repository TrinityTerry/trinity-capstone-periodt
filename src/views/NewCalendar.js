import React, { useEffect, useState } from "react";
import APIManager from "../modules/APIManager";
import PT_CALENDAR from "../components/calendar/PT_CALENDAR";
import * as moment from "moment";
const NewCalendar = ({ userData, userInfo }) => {
  const [cycles, setCycles] = useState({});

  const getCycles = () => {
    APIManager.getUserCycles(userData.uid).then(setCycles);
  };

  useEffect(() => {
    getCycles();
  }, []);
  return (
    <>
      {Object.keys(cycles).map(prop => {
        console.log(cycles[prop].period_end, cycles[prop].period_start);
        console.log(cycles[prop].period_end > cycles[prop].period_start);

        return (
          <PT_CALENDAR
            date={moment(cycles[prop].period_start, "YYYY-MM-DD").format(
              "YYYY-MM"
            )}
          />
        );
      })}
    </>
  );
};

export default NewCalendar;
