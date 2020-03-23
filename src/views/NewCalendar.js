import React, { useEffect, useState } from "react";
import APIManager from "../modules/APIManager";
import PT_CALENDAR from "../components/calendar/PT_CALENDAR";
import PT_MODAL from "../components/modals/PT_MODAL";
import * as moment from "moment";
import { Card } from "semantic-ui-react";
import * as firebase from "firebase";
const NewCalendar = ({ userData, userInfo }) => {
  const [cycles, setCycles] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [calMonths, setCalMonths] = useState([]);

  useEffect(() => {
    firebase
      .database()
      .ref("cycles")
      .on("child_changed", snapshot => {
        getCycles();
      });
  }, []);

  const getCycles = () => {
    APIManager.getUserCycles(userData.uid).then(data => {
      setCycles(data);
      const months = [];
      const startDays = [];
      const endDays = [];
      for (let prop in data) {
        if (
          !months.includes(
            `${data[prop].period_start.split("-")[0]}-${
              data[prop].period_start.split("-")[1]
            }`
          )
        ) {
          months.push(
            `${data[prop].period_start.split("-")[0]}-${
              data[prop].period_start.split("-")[1]
            }`
          );
        }
        if (
          !months.includes(
            `${data[prop].cycle_end.split("-")[0]}-${
              data[prop].cycle_end.split("-")[1]
            }`
          )
        ) {
          months.push(
            `${data[prop].cycle_end.split("-")[0]}-${
              data[prop].cycle_end.split("-")[1]
            }`
          );
        }

        if (!startDays.includes(data[prop].period_start)) {
          startDays.push(data[prop].period_start);
        }

        if (!endDays.includes(data[prop].period_end)) {
          endDays.push(data[prop].period_end);
        }
      }

      const calInfo = [];
      months.forEach(element => {
        const endPeriodDay = [];
        endDays.forEach(day => {
          if (`${day.split("-")[0]}-${day.split("-")[1]}` === element) {
            endPeriodDay.push(day.split("-")[2]);
          }
        });
        const startPeriodDay = [];
        startDays.forEach(day => {
          if (`${day.split("-")[0]}-${day.split("-")[1]}` === element) {
            startPeriodDay.push(day.split("-")[2]);
          }
        });
        calInfo.push({
          endPeriodDay: endPeriodDay,
          month: element,
          startPeriodDay: startPeriodDay
        });
      });

      setCalMonths(calInfo);
    });
  };

  const handleLog = e => {};

  const handleClick = (e, date) => {
    const split = date.split("-");
    const modalContent = [];
    for (let prop in cycles) {
      const startSplit = cycles[prop].period_start.split("-");
      const endSplit = cycles[prop].period_end.split("-");

      const sameStart = [];
      startSplit.forEach((element, i) => {
        sameStart.push(element === split[i]);
      });

      if (
        moment(date, "YYYY-MM-DD").isSameOrAfter(
          moment(cycles[prop].period_start, "YYYY-MM-DD")
        ) &&
        moment(date, "YYYY-MM-DD").isSameOrBefore(
          moment(cycles[prop].period_end, "YYYY-MM-DD")
        )
      ) {
        modalContent.push(
          <div
            onClick={handleLog}
            id={`${prop}--period-day`}
            key={`${prop}--period-day`}
          >
            Period Day{" "}
            {moment(date, "YYYY-MM-DD").diff(
              moment(cycles[prop].period_start, "YYYY-MM-DD"),
              "days"
            ) + 1}{" "}
            of{" "}
            {moment(cycles[prop].period_end, "YYYY-MM-DD").diff(
              moment(cycles[prop].period_start, "YYYY-MM-DD"),
              "days"
            ) + 1}
            <button>Edit</button>
            <hr />
          </div>
        );
      }

      if (!sameStart.includes(false)) {
        modalContent.push(
          <div
            onClick={handleLog}
            id={`${prop}--started`}
            key={`${prop}--started`}
          >
            Period Started On this Day
            <hr />
          </div>
        );
      }

      const sameEnd = [];
      endSplit.forEach((element, i) => {
        sameEnd.push(element === split[i]);
      });

      if (!sameEnd.includes(false)) {
        modalContent.push(
          <div onClick={handleLog} id={`${prop}--ended`} key={`${prop}--ended`}>
            Period Ended On this Day
            <hr />
          </div>
        );
      }
    }

    if (modalContent.length > 0) {
      setModalContent(modalContent);
      setOpenModal(true);
    }
  };

  const handleAction = e => {
    setOpenModal(false);
  };

  useEffect(() => {
    getCycles();
  }, []);

  return (
    <>
      <PT_MODAL
        actionItems={["ok"]}
        handleAction={handleAction}
        isOpen={openModal}
        size={"mini"}
        content={{
          mainText: modalContent.map(item => item)
        }}
      />
      <Card.Group>
        {calMonths.map(month => {
          return (
            <PT_CALENDAR
              key={month.month}
              groupClass="my-calendar-card"
              date={month.month}
              handleClick={handleClick}
              startPeriodDay={month.startPeriodDay}
              endPeriodDay={month.endPeriodDay}
            />
          );
        })}
      </Card.Group>
    </>
  );
};

export default NewCalendar;
