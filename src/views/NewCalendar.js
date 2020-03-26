import React, { useEffect, useState } from "react";
import APIManager from "../modules/APIManager";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_CALENDAR from "../components/calendar/PT_CALENDAR";
import PT_MODAL from "../components/modals/PT_MODAL";
import * as moment from "moment";
import { Card } from "semantic-ui-react";
import * as firebase from "firebase";
import { logDOM } from "@testing-library/react";
const NewCalendar = ({ userData, userInfo }) => {
  const [cycles, setCycles] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [calMonths, setCalMonths] = useState([]);
  const [logs, setLogs] = useState({});
  const [moods, setMoods] = useState([]);
  const [flows, setFlows] = useState([]);
  const [modalDate, setModalDate] = useState("");
  const [editing, setEditing] = useState({
    mood: {},
    flow: {},
    notes: {},
    period: {}
  });

  useEffect(() => {
    firebase
      .database()
      .ref("cycles")
      .on("child_changed", snapshot => {
        getCycles();
      });
    getMoods();
    getFlows();
  }, []);

  const getMoods = () => {
    APIManager.getResource("mood_types").then(data => {
      const newArray = [];

      for (let moodId in data) {
        newArray.push({ name: data[moodId].name, id: moodId });
      }
      setMoods(newArray);
    });
  };

  const getFlows = () => {
    APIManager.getResource("flow_types").then(data => {
      const newArray = [];
      for (let moodId in data) {
        newArray.push({ name: data[moodId].name, id: moodId });
      }
      setFlows(newArray);
    });
  };

  const getCycles = () => {
    if (userInfo) {
      APIManager.getUserCycles(userData.uid).then(data => {
        const newObj = {};
        APIManager.getResource(`mood_logs/${userData.uid}`)
          .then(moods => {
            const newArray = [];
            for (let props in moods) {
              newArray.push({
                data: moods[props],
                id: props,
                isEditing: false
              });
            }
            newObj.mood_logs = newArray;
          })
          .then(() => {
            APIManager.getResource(`flow_logs/${userData.uid}`)
              .then(flows => {
                const newArray = [];
                for (let props in flows) {
                  newArray.push({
                    data: flows[props],
                    id: props,
                    isEditing: false
                  });
                }
                newObj.flow_logs = newArray;
              })
              .then(() => {
                APIManager.getResource(`note_logs/${userData.uid}`).then(
                  notes => {
                    const newArray = [];
                    for (let props in notes) {
                      newArray.push({
                        data: notes[props],
                        id: props,
                        isEditing: false
                      });
                    }
                    newObj.note_logs = newArray;
                    setLogs(newObj);

                    setCycles(data);
                    const months = [];
                    const startDays = [];
                    const endDays = [];
                    let cycleEndDates = [];

                    for (let cycle in data) {
                      cycleEndDates.push({
                        cycleData: data[cycle],
                        cycleId: cycle
                      });
                    }
                    cycleEndDates.sort(
                      (a, b) =>
                        moment(a.cycleData.cycle_end, "YYYY-MM-DD").format(
                          "YYYYMMDD"
                        ) -
                        moment(b.cycleData.cycle_end, "YYYY-MM-DD").format(
                          "YYYYMMDD"
                        )
                    );

                    cycleEndDates.forEach(item => {
                      if (
                        !months.includes(
                          `${item.cycleData.period_start.split("-")[0]}-${
                            item.cycleData.period_start.split("-")[1]
                          }`
                        )
                      ) {
                        months.push(
                          `${item.cycleData.period_start.split("-")[0]}-${
                            item.cycleData.period_start.split("-")[1]
                          }`
                        );
                      }
                      if (
                        !months.includes(
                          `${item.cycleData.cycle_end.split("-")[0]}-${
                            item.cycleData.cycle_end.split("-")[1]
                          }`
                        )
                      ) {
                        months.push(
                          `${item.cycleData.cycle_end.split("-")[0]}-${
                            item.cycleData.cycle_end.split("-")[1]
                          }`
                        );
                      }

                      if (!startDays.includes(item.cycleData.period_start)) {
                        startDays.push(item.cycleData.period_start);
                      }

                      if (!endDays.includes(item.cycleData.period_end)) {
                        endDays.push(item.cycleData.period_end);
                      }
                    });
                    const logDays = [];
                    newObj.mood_logs.forEach(item => {
                      !logDays.includes(item.data.date) &&
                        logDays.push(item.data.date);
                    });

                    newObj.flow_logs.forEach(item => {
                      logDays.includes(item.data.date) &&
                        logDays.push(item.data.date);
                    });

                    newObj.note_logs.forEach(item => {
                      logDays.includes(item.data.date) &&
                        logDays.push(item.data.date);
                    });
                    logDays.forEach(item => {
                      !months.includes(
                        `${item.split("-")[0]}-${item.split("-")[1]}`
                      ) &&
                        months.push(
                          `${item.split("-")[0]}-${item.split("-")[1]}`
                        );
                    });

                    months.sort();
                    const firstMonth = months[0].split("-")[1];
                    const lastMonth = months[months.length - 1].split("-")[1];
                    const firstYear = months[0].split("-")[0];
                    const lastYear = months[months.length - 1].split("-")[0];

                    const newMonths = [];

                    for (
                      let year = Number(firstYear);
                      year <= Number(lastYear);
                      year++
                    ) {
                      for (let month = 1; month <= 12; month++) {
                        if (firstYear == year && month >= firstMonth) {
                          newMonths.push(
                            `${year}-${month < 10 ? `0${month}` : month}`
                          );
                        }
                        if (year > firstYear && year < lastYear) {
                          newMonths.push(
                            `${year}-${month < 10 ? `0${month}` : month}`
                          );
                        }
                        if (lastYear == year && month <= lastMonth) {
                          newMonths.push(
                            `${year}-${month < 10 ? `0${month}` : month}`
                          );
                        }
                      }
                    }

                    newMonths.sort();

                    let lastCycle =
                      cycleEndDates[cycleEndDates.length - 1].cycleData
                        .cycle_end;
                    const predictStart = [];
                    const predictEnd = [];
                    for (let i = 0; i < 3; i++) {
                      let cycle_end = moment(lastCycle)
                        .add(userInfo.averageCycleDays, "days")
                        .format("YYYY-MM-DD");
                      predictStart.push(
                        moment(lastCycle)
                          .add(1, "days")
                          .format("YYYY-MM-DD")
                      );
                      predictEnd.push(
                        moment(lastCycle)
                          .add(userInfo.averagePeriodDays, "days")
                          .format("YYYY-MM-DD")
                      );

                      lastCycle = cycle_end;
                    }

                    const futureMonths = moment(lastCycle, "YYYY-MM-DD").diff(
                      moment(months[months.length - 1], "YYYY-MM"),
                      "months"
                    );
                    let year = Number(lastYear);
                    for (let i = 1; i <= futureMonths; i++) {
                      let month;

                      if (Number(lastMonth) + i > 12) {
                        month = (Number(lastMonth) + i) % 12;
                      } else {
                        month = Number(lastMonth) + i;
                      }
                      if (i > 1 && month == 1) {
                        year++;
                      }
                      newMonths.push(
                        `${year}-${month < 10 ? `0${month}` : month}`
                      );
                    }

                    const calInfo = [];

                    newMonths.forEach(element => {
                      const startPeriodDay = [];
                      startDays.forEach(day => {
                        // console.log(day);

                        if (
                          `${day.split("-")[0]}-${day.split("-")[1]}` ===
                          element
                        ) {
                          startPeriodDay.push(day.split("-")[2]);
                        }
                      });

                      const endPeriodDay = [];
                      endDays.forEach(day => {
                        if (
                          `${day.split("-")[0]}-${day.split("-")[1]}` ===
                          element
                        ) {
                          endPeriodDay.push(day.split("-")[2]);
                        }
                      });
                      if (endPeriodDay.length < startPeriodDay.length) {
                        endPeriodDay.push(moment(element).daysInMonth());
                      }

                      if (startPeriodDay.length < endPeriodDay.length) {
                        startPeriodDay.unshift("01");
                      }

                      if (element > `${lastYear}-${lastMonth}`) {
                        // console.log(element);
                      }

                      const predictStartPeriodDay = [];
                      predictStart.forEach(day => {
                        if (
                          `${day.split("-")[0]}-${day.split("-")[1]}` ===
                          element
                        ) {
                          predictStartPeriodDay.push(day.split("-")[2]);
                        }
                      });

                      const predictEndPeriodDay = [];
                      predictEnd.forEach(day => {
                        if (
                          `${day.split("-")[0]}-${day.split("-")[1]}` ===
                          element
                        ) {
                          predictEndPeriodDay.push(day.split("-")[2]);
                        }
                      });
                      if (
                        predictEndPeriodDay.length <
                        predictStartPeriodDay.length
                      ) {
                        predictEndPeriodDay.push(moment(element).daysInMonth());
                      }

                      if (
                        predictStartPeriodDay.length <
                        predictEndPeriodDay.length
                      ) {
                        predictStartPeriodDay.unshift("01");
                      }

                      if (element > `${lastYear}-${lastMonth}`) {
                        // console.log(element);
                      }
                      const hasLog = [];
                      logDays.forEach(log => {
                        if (
                          `${log.split("-")[0]}-${log.split("-")[1]}` == element
                        ) {
                          !hasLog.includes(log.split("-")[2]) &&
                            hasLog.push(log.split("-")[2]);
                        }
                      });

                      calInfo.push({
                        endPeriodDay: endPeriodDay,
                        month: element,
                        startPeriodDay: startPeriodDay,
                        predictStartPeriodDay: predictStartPeriodDay,
                        predictEndPeriodDay: predictEndPeriodDay,
                        logDays: hasLog
                      });
                    });

                    setCalMonths(calInfo);
                  }
                );
              });
          });
      });
    }
  };

  const handleLog = e => {
    const split = e.currentTarget.id.split("--");

    if (split[1] == "edit") {
      setModalContent(prev => {
        prev[split[0]].isEditing = true;
        return { ...prev };
      });
    }
  };

  const handleClick = (e, date) => {
    const split = date.split("-");
    const modalContentArray = {};
    setModalDate(moment(date).format("MMM DD, YYYY"));
    const newObj = { ...editing };
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
        modalContentArray[prop] = {};

        // newObj.period[prop] = false;
        modalContentArray[prop].node = (
          <div key={`${prop}--period`}>
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
            <div className="cal-modal-buttons">
              <PT_BUTTON
                handleClick={handleLog}
                id={`${prop}--edit--period`}
                icon="edit"
              />
              <PT_BUTTON
                handleClick={handleLog}
                id={`${prop}--trash--period`}
                icon="trash"
              />
            </div>
            <hr />
          </div>
        );
        modalContentArray[prop].change = (
          <div key={`${prop}--period`}>
            Editing
            <div className="cal-modal-buttons">
              <PT_BUTTON
                handleClick={handleLog}
                id={`${prop}--cancel--period`}
                icon="x"
              />
              <PT_BUTTON
                handleClick={handleLog}
                id={`${prop}--submit--period`}
                icon="check"
              />
            </div>
            <hr />
          </div>
        );
        modalContentArray[prop].isEditing = false;
      }

      const sameEnd = [];
      endSplit.forEach((element, i) => {
        sameEnd.push(element === split[i]);
      });
    }
    APIManager.getLogByDate(userData.uid, "mood", date).then(moodLogs => {
      APIManager.getLogByDate(userData.uid, "note", date).then(noteLogs => {
        APIManager.getLogByDate(userData.uid, "flow", date).then(flowLogs => {
          const moodKeys = Object.keys(moodLogs);
          const noteKeys = Object.keys(noteLogs);
          const flowKeys = Object.keys(flowLogs);

          if (moodKeys.length) {
            const moodArray = [];
            moodKeys.forEach(item => {
              moods.forEach((mood, i) => {
                if (mood.id == moodLogs[item].mood_typeId) {
                  newObj.mood[item] = false;
                  moodArray.push({
                    name: mood.name,
                    id: item,
                    isEditing: false
                  });
                }
              });
            });
            // console.log(newObj);

            // modalContentArray[item].header = <h2 key="moods">Moods</h2>;
            moodArray.map(item => {
              modalContentArray[item.id] = {};
              modalContentArray[item.id].node = (
                <div key={`${item.id}--ended`}>
                  {item.name}
                  <div className="cal-modal-buttons">
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--edit--mood`}
                      icon="edit"
                    />
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.mid}--trash---mood`}
                      icon="trash"
                    />
                  </div>
                  <hr />
                </div>
              );
              modalContentArray[item.id].change = (
                <div key={`${item.id}--ended`}>
                  Editing
                  <div className="cal-modal-buttons">
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--cancel--mood`}
                      icon="x"
                    />
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.mid}--submit---mood`}
                      icon="check"
                    />
                  </div>
                  <hr />
                </div>
              );
              modalContentArray[item.id].isEditing = false;
            });
          }
          if (noteKeys.length) {
            const noteArray = [];
            noteKeys.forEach(item => {
              newObj.notes[item] = false;
              noteArray.push({ content: noteLogs[item].content, id: item });
            });

            // modalContentArray.push(<h2 key="notes">Notes</h2>);
            noteArray.map(item => {
              modalContentArray[item.id] = {};
              modalContentArray[item.id].node = (
                <div key={`${item.id}--ended`}>
                  {item.content}
                  <div className="cal-modal-buttons">
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--edit--note`}
                      icon="edit"
                    />
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.mid}--trash---note`}
                      icon="trash"
                    />
                  </div>
                  <hr />
                </div>
              );
              modalContentArray[item.id].change = (
                <div key={`${item.id}--ended`}>
                  Editing{" "}
                  <div className="cal-modal-buttons">
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--cancel--note`}
                      icon="x"
                    />
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.mid}--submit---note`}
                      icon="check"
                    />
                  </div>
                  <hr />
                </div>
              );
              modalContentArray[item.id].isEditing = false;
            });
          }

          if (flowKeys.length) {
            const flowArray = [];
            flowKeys.forEach(item => {
              flows.forEach((flow, i) => {
                if (flow.id == flowLogs[item].flow_typeId) {
                  newObj.flow[item] = false;
                  flowArray.push({ name: flow.name, id: item });
                }
              });
            });

            // modalContentArray.push(<h2 key="flows">Flows</h2>);
            flowArray.map(item => {
              modalContentArray[item.id] = {};
              modalContentArray[item.id].node = (
                <div key={`${item.id}--ended`}>
                  {item.name}
                  <div className="cal-modal-buttons">
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--edit--flow`}
                      icon="edit"
                    />
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.mid}--trash---flow`}
                      icon="trash"
                    />
                  </div>
                  <hr />
                </div>
              );
              modalContentArray[item.id].change = (
                <div key={`${item.id}--ended`}>
                  Editing{" "}
                  <div className="cal-modal-buttons">
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--cancel--flow`}
                      icon="x"
                    />
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.mid}--submit---flow`}
                      icon="check"
                    />
                  </div>
                  <hr />
                </div>
              );
              modalContentArray[item.id].isEditing = false;
            });
          }
          setEditing(newObj);
          console.log(modalContentArray);

          setModalContent(modalContentArray);
        });
      });
    });
  };

  const handleAction = e => {
    setModalContent({});
    setOpenModal(false);
  };

  useEffect(() => {
    // getCycles();
    if (Object.keys(modalContent).length > 0) {
      setOpenModal(true);
    } else {
      setOpenModal(false);
    }
  }, [modalContent]);

  useEffect(() => {
    getCycles();
  }, [userInfo]);

  return (
    <>
      {modalContent && (
        <PT_MODAL
          actionItems={["ok"]}
          handleAction={handleAction}
          isOpen={openModal}
          size={"mini"}
          content={{
            mainText: Object.keys(modalContent).map(item => {
              // console.log(modalContent[item]);

              return modalContent[item].isEditing
                ? modalContent[item].change
                : modalContent[item].node;
            }),
            modalHeader: modalDate
          }}
        />
      )}
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
              predictStart={month.predictStartPeriodDay}
              predictEnd={month.predictEndPeriodDay}
              logDays={month.logDays}
            />
          );
        })}
      </Card.Group>
    </>
  );
};

export default NewCalendar;
