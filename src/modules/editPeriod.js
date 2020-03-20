import * as moment from "moment";
import APIManager from "./APIManager";

const editPeriod = {
  startPeriod(currentCycle, userData, userInfo) {
      console.log(currentCycle);
      
    if (moment().isBefore(currentCycle.cycleData.cycle_end, "days")) {
      APIManager.updateCycle(userData.uid, currentCycle.cycleId, {
        cycle_end: moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD")
      });
    }
    if (userInfo.averagePeriodDays > 0) {
      return {
        period_start: moment().format("YYYY-MM-DD"),
        period_end: moment()
          .add(userInfo.averagePeriodDays, "days")
          .format("YYYY-MM-DD"),
        cycle_end: moment()
          .add(userInfo.averageCycleDays, "days")
          .format("YYYY-MM-DD")
      };
    } else {
      APIManager.updateUser(
        { averagePeriodDays: 5, averageCycleDays: 28 },
        userData.uid
      );
      return {
        period_start: moment().format("YYYY-MM-DD"),
        period_end: moment()
          .add(5, "days")
          .format("YYYY-MM-DD"),
        cycle_end: moment()
          .add(28, "days")
          .format("YYYY-MM-DD")
      };
    }
  }
};

export default editPeriod;
