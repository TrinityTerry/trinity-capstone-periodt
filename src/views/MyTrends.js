import React, { useEffect, useState } from "react";
import APIManager from "../modules/APIManager";
import * as moment from "moment";

const MyTrends = ({ userData, userInfo }) => {
  const [cycles, setCycles] = useState({});
  const [cycleTrend, setCycleTrend] = useState({});

  const getCycles = () => {
    APIManager.getUserCycles(userData.uid).then(setCycles);
  };

  useEffect(() => {
    getCycles();
  }, []);

  useEffect(() => {
    if (Object.keys(cycles).length > 0) {
      let totalDays = 0;
      for (let prop in cycles) {
        const days = moment(cycles[prop].cycle_end).diff(
          moment(cycles[prop].period_start),
          "days"
        );
        if (days > totalDays) {
          totalDays = days;
        }
      }
      for (let i = 1; i <= totalDays; i++) {
        console.log(i);
      }
      console.log(totalDays);
    }
  }, [cycles]);

  return <>This is the trends</>;
};
export default MyTrends;
