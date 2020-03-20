import React, { useEffect, useState } from "react";
import APIManager from "../modules/APIManager";
import PT_CALENDAR from "../components/calendar/PT_CALENDAR";
import PT_MODAL from "../components/modals/PT_MODAL";
import * as moment from "moment";
import { Card } from "semantic-ui-react";
const NewCalendar = ({ userData, userInfo }) => {
  const [cycles, setCycles] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [calMonths, setCalMonths] = useState([]);

  const getCycles = () => {
    APIManager.getUserCycles(userData.uid).then(data => {
      setCycles(data);
      const months = [];
      for (let prop in data) {
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
      }
      setCalMonths(months);
    });
  };

  const handleLog = e => {
    console.log(e.target.id);
  };

  const handleClick = (e, date) => {
    const split = date.split("-");
    const modalContent = [];
    for (let prop in cycles) {
      const startSplit = cycles[prop].period_start.split("-");
      const endSplit = cycles[prop].period_end.split("-");
      const sameStart = [];
      startSplit.forEach((element, i) => {
        sameStart.push(element == split[i]);
      });

      if (!sameStart.includes(false)) {
        modalContent.push(
          <>
            <div onClick={handleLog} id={`${prop}--started`}>
              Period Started On this Day
            </div>
            <hr />
          </>
        );
      }

      const sameEnd = [];
      endSplit.forEach((element, i) => {
        sameEnd.push(element == split[i]);
      });

      if (!sameEnd.includes(false)) {
        modalContent.push(
          <>
            <div onClick={handleLog} id={`${prop}--ended`}>
              Period Ended On this Day
            </div>
            <hr />
          </>
        );
      }
    }

    if (modalContent.length > 0) {
      console.log(modalContent);

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
              groupClass="my-calendar-card"
              date={month}
              handleClick={handleClick}
            />
          );
        })}
      </Card.Group>
    </>
  );
};

export default NewCalendar;
