import React, { useState, useEffect } from "react";
import PT_BUTTON from "./PT_BUTTON";
import PT_MODAL from "../modals/PT_MODAL";
import PT_ICON from "../icons/PT_ICON";
import * as firebase from "firebase";
import * as moment from "moment";
import APIManager from "../../modules/APIManager";

const PT_PERIODSTART = ({ isOnPeriod, userData, currentCycle, userInfo }) => {
  const [openEndPeriodModal, setOpenEndPeriodModal] = useState(false);
  const [endPeriodContent, setEndPeriodContent] = useState({
    header: "",
    main: ""
  });
  const [currentId, setCurrentId] = useState(null);


  const updateCycle = () => {

    const key = makeKey();
    const ref = `cycles/${userData.uid}/${currentCycle.cycleId}`;
    const newObj = { ...currentCycle.cycleData };
    newObj.period_end = moment().format("YYYY-MM-DD");

    APIManager.updateLog(ref, newObj);
  };

  const getId = () => {
    return currentId;
  };
  const makeKey = ref => {
    return firebase
      .database()
      .ref()
      .child("child")
      .push().key;
  };
  const handleClick = e => {
    setCurrentId(e.target.value);
    if (isOnPeriod) {
        updateCycle();

    } else {
      const key = makeKey();
      const ref = `cycles/${userData.uid}/${key}`;

      let obj;
      if (moment().isBefore(currentCycle.cycleData.cycle_end, "days")) {
        APIManager.updateCycle(userData.uid, currentCycle.cycleId, {
          cycle_end: moment()
            .subtract(1, "days")
            .format("YYYY-MM-DD")
        });
      }
      if (userInfo.averagePeriodDays > 0) {
        obj = {
          period_start: moment().format("YYYY-MM-DD"),
          period_end: moment()
            .add(userInfo.averagePeriodDays, "days")
            .format("YYYY-MM-DD"),
          cycle_end: moment()
            .add(userInfo.averageCycleDays, "days")
            .format("YYYY-MM-DD")
        };
      } else {
        obj = {
          period_start: moment().format("YYYY-MM-DD"),
          period_end: moment()
            .add(5, "days")
            .format("YYYY-MM-DD"),
          cycle_end: moment()
            .add(28, "days")
            .format("YYYY-MM-DD")
        };

        APIManager.updateUser(
          { averagePeriodDays: 5, averageCycleDays: 28 },
          userData.uid
        );
      }
      APIManager.updateLog(ref, obj);
    }
  };

  return (
    <>
      {currentCycle !== undefined && (
        <PT_MODAL
          content={{
            mainText: endPeriodContent.header,
            modalHeader: (
              <PT_ICON
                name="delete"
                onClick={() => setOpenEndPeriodModal(false)}
              />
            )
          }}
          isOpen={openEndPeriodModal}
          actionItems={["delete", "save"]}
          currentCycle={currentCycle}
          size="tiny"
        />
      )}
      <PT_BUTTON
        icon={"plus"}
        handleClick={handleClick}
        content={isOnPeriod ? "Period Ended" : "Period Started"}
        circular={true}
        size="huge"
        value={currentCycle && currentCycle.cycleId}
        buttonClass="home-page-button"
      />
    </>
  );
};

export default PT_PERIODSTART;
