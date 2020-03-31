import React, { useEffect, useState } from "react";
import APIManager from "../modules/APIManager";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_CALENDAR from "../components/calendar/PT_CALENDAR";
import PT_MODAL from "../components/modals/PT_MODAL";
import PT_INPUT from "../components/inputs/PT_INPUT";
import * as moment from "moment";
import { Card, Select } from "semantic-ui-react";
import * as firebase from "firebase";
import { logDOM } from "@testing-library/react";
import { useRouteMatch } from "react-router-dom";
const NewCalendar = ({ userData, userInfo }) => {
  const [cycles, setCycles] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [sortedIds, setSortedIds] = useState([]);

  const [calMonths, setCalMonths] = useState([]);
  const [logs, setLogs] = useState({});
  const [moods, setMoods] = useState([]);
  const [flows, setFlows] = useState([]);
  const [modalDate, setModalDate] = useState("");
  const [editing, setEditing] = useState({
    // mood: {},
    // flow: {},
    // notes: {},
    // period: {}
  });

  useEffect(() => {
    getMoods();
    getFlows();
  }, []);
  useEffect(() => {
    firebase
      .database()
      .ref("cycles")
      .on("child_changed", snapshot => {
        getCycles();
        // checkCycles()
      });
  });

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
                        if (firstYear == lastYear) {
                          if (
                            firstYear == year &&
                            month >= firstMonth &&
                            month <= lastMonth
                          ) {
                            newMonths.push(
                              `${year}-${month < 10 ? `0${month}` : month}`
                            );
                          }
                        } else if (firstYear == year && month >= firstMonth) {
                          newMonths.push(
                            `${year}-${month < 10 ? `0${month}` : month}`
                          );
                        } else if (lastYear == year && month <= lastMonth) {
                          newMonths.push(
                            `${year}-${month < 10 ? `0${month}` : month}`
                          );
                        }
                        // console.log(newMonths);
                        if (year > firstYear && year < lastYear) {
                          newMonths.push(
                            `${year}-${month < 10 ? `0${month}` : month}`
                          );
                        }
                      }
                    }

                    newMonths.sort();
                    // console.log(cycleEndDates);
                    const predictStart = [];
                    const predictEnd = [];
                    let lastCycle;
                    if (cycleEndDates.length > 0) {
                      lastCycle =
                        cycleEndDates[cycleEndDates.length - 1].cycleData
                          .cycle_end;
                      // console.log(lastCycle);

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
                    console.log(calInfo);

                    setCalMonths(calInfo);
                  }
                );
              });
          });
      });
    }
  };

  useEffect(() => {
    const sortedArray =
      cycles &&
      Object.keys(cycles).sort((a, b) => {
        if (
          moment(cycles[a].period_start, "YYYY-MM-DD").isBefore(
            moment(cycles[b].period_start, "YYYY-MM-DD")
          )
        ) {
          return 1;
        } else {
          return -1;
        }
      });
    setSortedIds(sortedArray ? sortedArray : []);
  }, [cycles]);

  useEffect(() => {
    sortedIds.forEach((item, i) => {
      const newObj = { ...cycles[sortedIds[i + 1]] };
      const id = sortedIds[i + 1];
      if (sortedIds[i + 1] !== undefined) {
        if (
          !moment(cycles[item].period_start, "YYYY-MM-DD").isAfter(
            moment(cycles[sortedIds[i + 1]].cycle_end, "YYYY-MM-DD")
          ) ||
          moment(cycles[item].period_start, "YYYY-MM-DD").diff(
            moment(cycles[sortedIds[i + 1]].cycle_end, "YYYY-MM-DD"),
            "days"
          ) !== 1
        ) {
          newObj.cycle_end = moment(cycles[item].period_start)
            .subtract(1, "days")
            .format("YYYY-MM-DD");
          APIManager.updateCycle(userData.uid, id, newObj);
        }
      }
    });
  }, [sortedIds]);

  // const checkCycles = () => {
  // sortedIds.forEach((item, i) => {
  //   const newObj = { ...cycles[sortedIds[i + 1]] };
  //   const id = sortedIds[i + 1];
  //   if (sortedIds[i + 1] !== undefined) {
  //     if (
  //       !moment(cycles[item].period_start, "YYYY-MM-DD").isAfter(
  //         moment(cycles[sortedIds[i + 1]].cycle_end, "YYYY-MM-DD")
  //       )
  //     ) {
  //       newObj.cycle_end = moment(cycles[item].period_start)
  //         .subtract(1, "days")
  //         .format("YYYY-MM-DD");
  //       APIManager.updateCycle(userData.uid, id, newObj);
  //     }
  //   }
  // });
  // };

  const handleLog = e => {
    const split = e.currentTarget.id.split("--");

    if (split[1] == "edit") {
      setModalContent(prev => {
        prev[split[0]].isEditing = true;
        return { ...prev };
      });
    } else if (split[1] == "cancel") {
      logs.note_logs.forEach(item => {
        if (item.id == split[0]) {
          setEditing(prev => {
            prev[split[2]][split[0]].content = item.data.content;
            return { ...prev };
          });
        }
      });

      setModalContent(prev => {
        prev[split[0]].isEditing = false;
        return { ...prev };
      });
    } else if (split[1] == "submit") {
      if (split[2] == "period") {
        APIManager.updateCycle(
          userData.uid,
          split[0],
          editing.period[split[0]]
        ).then(() => {
          setModalContent(prev => {
            prev[split[0]].isEditing = true;
            return { ...prev };
          });
          setModalDate(prev => {
            handleClick(
              "sdf",
              moment(prev, "MMM DD, YYYY").format("YYYY-MM-DD")
            );

            return prev;
          });
        });
      } else {
        setEditing(prev => {
          APIManager.updateLog(
            `${split[2]}_logs/${userData.uid}/${split[0]}`,
            prev[split[2]][split[0]]
          ).then(() => {
            setModalContent(modalPrev => {
              modalPrev[split[0]].isEditing = false;
              return { ...modalPrev };
            });

            setModalDate(timePrev => {
              handleClick(
                "sdf",
                moment(timePrev, "MMM DD, YYYY").format("YYYY-MM-DD")
              );

              return timePrev;
            });
          });
          return { ...prev };
        });
      }

      setEditing(prev => {
        return { ...prev };
      });
    } else if (split[1] == "trash") {
      if (split[2] == "period") {
        APIManager.deleteLog(`cycles`, userData.uid, split[0]).then(() => {
          setModalContent(modalPrev => {
            modalPrev[split[0]].isEditing = false;
            return { ...modalPrev };
          });

          setModalDate(timePrev => {
            handleClick(
              "sdf",
              moment(timePrev, "MMM DD, YYYY").format("YYYY-MM-DD")
            );

            return timePrev;
          });
        });
      } else {
        APIManager.deleteLog(`${split[2]}_logs`, userData.uid, split[0]).then(
          () => {
            setModalContent(modalPrev => {
              modalPrev[split[0]].isEditing = false;
              return { ...modalPrev };
            });

            setModalDate(timePrev => {
              handleClick(
                "sdf",
                moment(timePrev, "MMM DD, YYYY").format("YYYY-MM-DD")
              );

              return timePrev;
            });
          }
        );
      }
    }
  };

  const handleClick = (e, date) => {
    const split = date.split("-");
    const modalContentArray = {};
    setModalDate(moment(date).format("MMM DD, YYYY"));
    const editingObj = {
      period: {},
      mood: {},
      flow: {},
      note: {}
    };

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
        modalContentArray[prop].name = "period";
        editingObj.period[prop] = {
          cycle_end: cycles[prop].cycle_end,
          period_start: cycles[prop].period_start,
          period_end: cycles[prop].period_end
        };
        modalContentArray[prop].node = (
          <div key={`${prop}--period`}>
            <h2>Period Info</h2>
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
            <h2>Period Info</h2>
            <PT_INPUT />
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
          // editingObj.period = {};
          if (moodKeys.length) {
            const moodArray = [];
            moodKeys.forEach(item => {
              moods.forEach((mood, i) => {
                if (mood.id == moodLogs[item].mood_typeId) {
                  moodArray.push({
                    name: mood.name,
                    id: item,
                    isEditing: false,
                    date: moodLogs[item].date,
                    mood_typeId: moodLogs[item].mood_typeId
                  });
                }
              });
            });

            // modalContentArray[item].header = <h2 key="moods">Moods</h2>;
            moodArray.map((item, i) => {
              modalContentArray[item.id] = {};
              modalContentArray[item.id].name = "mood";
              editingObj.mood[item.id] = {
                date: item.date,
                isDraft: false,
                mood_typeId: item.mood_typeId
              };

              modalContentArray[item.id].node = (
                <div key={`${item.id}--ended`}>
                  {i == 0 && <h2>Mood</h2>}
                  {item.name}
                  <div className="cal-modal-buttons">
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--edit--mood`}
                      icon="edit"
                    />
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--trash--mood`}
                      icon="trash"
                    />
                  </div>
                  <hr />
                </div>
              );
              modalContentArray[item.id].change = (
                <div key={`${item.id}--ended`}>
                  {i == 0 && <h2>Moods</h2>}
                  <>
                    <Select
                      placeholder={`${item.name}`}
                      options={moods.map(keyName => {
                        return {
                          key: keyName.id,
                          value: `mood--${keyName.id}--${item.id}`,
                          text: keyName.name
                        };
                      })}
                      onChange={handleTypeChange}
                      key={item.id}
                    />
                  </>
                  <div className="cal-modal-buttons">
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--cancel--mood`}
                      icon="x"
                    />
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--submit--mood`}
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
              noteArray.push({
                content: noteLogs[item].content,
                id: item,
                date: noteLogs[item].date
              });
            });
            // modalContentArray.push(<h2 key="notes">Notes</h2>);
            noteArray.map((item, i) => {
              editingObj.note[item.id] = {
                date: item.date,
                isDraft: false,
                content: item.content
              };
              modalContentArray[item.id] = {};
              modalContentArray[item.id].name = "note";
              modalContentArray[item.id].id = item.id;
              modalContentArray[item.id].node = (
                <div key={`${item.id}--ended`}>
                  {i == 0 && <h2>Notes</h2>}
                  {item.content}
                  <div className="cal-modal-buttons">
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--edit--note`}
                      icon="edit"
                    />
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--trash--note`}
                      icon="trash"
                    />
                  </div>
                  <hr />
                </div>
              );

              modalContentArray[item.id].change = (
                <div key={`${item.id}--ended`}>
                  {i == 0 && <h2>Notes</h2>}
                  <PT_INPUT
                    type="textarea"
                    valueFromState={item.content}
                    name={`note--${item.id}`}
                    inputId={`note--${item.id}`}
                    handleChange={handleTextChange}
                  />
                  <div className="cal-modal-buttons">
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--cancel--note`}
                      icon="x"
                    />
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--submit--note`}
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
                  flowArray.push({
                    name: flow.name,
                    id: item,
                    date: flowLogs[item].date,
                    flow_typeId: flowLogs[item].flow_typeId
                  });
                }
              });
            });

            // modalContentArray.push(<h2 key="flows">Flows</h2>);
            flowArray.map((item, i) => {
              editingObj.flow[item.id] = {
                date: item.date,
                isDraft: false,
                flow_typeId: item.flow_typeId
              };
              modalContentArray[item.id] = {};
              modalContentArray[item.id].name = "flow";
              modalContentArray[item.id].node = (
                <div key={`${item.id}--ended`}>
                  {i == 0 && <h2>Flows</h2>}
                  {item.name}
                  <div className="cal-modal-buttons">
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--edit--flow`}
                      icon="edit"
                    />
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--trash--flow`}
                      icon="trash"
                    />
                  </div>
                  <hr />
                </div>
              );
              modalContentArray[item.id].change = (
                <div key={`${item.id}--ended`}>
                  <>
                    <Select
                      placeholder={`${item.name}`}
                      options={flows.map(keyName => {
                        return {
                          key: keyName.id,
                          value: `flow--${keyName.id}--${item.id}`,
                          text: keyName.name
                        };
                      })}
                      onChange={handleTypeChange}
                    />
                  </>
                  <div className="cal-modal-buttons">
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--cancel--flow`}
                      icon="x"
                    />
                    <PT_BUTTON
                      handleClick={handleLog}
                      id={`${item.id}--submit--flow`}
                      icon="check"
                    />
                  </div>
                  <hr />
                </div>
              );
              modalContentArray[item.id].isEditing = false;
            });
          }
          setEditing(editingObj);
          setModalContent(modalContentArray);
          // setOpenModal(true);
        });
      });
    });
  };

  const handleAction = e => {
    setModalContent({});
    setOpenModal(false);
  };

  const handleTextChange = (e, { value, name, id }) => {
    const split = name.split("--");
    setEditing(prev => {
      prev.note[split[1]].content = value;
      return { ...prev };
    });
  };

  const handleTypeChange = (e, { value, name }) => {
    const split = value.split("--");
    setEditing(prev => {
      prev[split[0]][split[2]][`${split[0]}_typeId`] = split[1];

      return { ...prev };
    });
  };

  const handleDateChange = (moment, id, position) => {
    // const split = value.split("--");
    setEditing(prev => {
      prev.period[id][`period_${position}`] = moment.format("YYYY-MM-DD");

      // prev

      return { ...prev };
    });
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
              if (modalContent[item].name == "note") {
                return modalContent[item].isEditing ? (
                  <div key={`${modalContent[item].id}--ended`}>
                    <PT_INPUT
                      type="textarea"
                      valueFromState={
                        editing.note[modalContent[item].id].content
                      }
                      name={`note--${modalContent[item].id}`}
                      inputId={`note--${modalContent[item].id}`}
                      handleChange={handleTextChange}
                    />
                    <div className="cal-modal-buttons">
                      <PT_BUTTON
                        handleClick={handleLog}
                        id={`${modalContent[item].id}--cancel--note`}
                        icon="x"
                      />
                      <PT_BUTTON
                        handleClick={handleLog}
                        id={`${modalContent[item].id}--submit--note`}
                        icon="check"
                      />
                    </div>
                    <hr />
                  </div>
                ) : (
                  modalContent[item].node
                );
              }

              if (modalContent[item].name == "period") {
                return modalContent[item].isEditing ? (
                  <div key={`${modalContent[item].id}--ended`}>
                    <PT_INPUT
                      type="date"
                      valueFromState={moment(
                        editing.period[item].period_start,
                        "YYYY-MM-DD"
                      )}
                      handleChange={e => handleDateChange(e, item, "start")}
                    />
                    <br />
                    <PT_INPUT
                      type="date"
                      valueFromState={moment(
                        editing.period[item].period_end,
                        "YYYY-MM-DD"
                      )}
                      handleChange={e => handleDateChange(e, item, "end")}
                      disableFuture={false}
                    />

                    <div className="cal-modal-buttons">
                      <PT_BUTTON
                        handleClick={handleLog}
                        id={`${item}--cancel--period`}
                        icon="x"
                      />
                      <PT_BUTTON
                        handleClick={handleLog}
                        id={`${item}--submit--period`}
                        icon="check"
                      />
                    </div>
                    <hr />
                  </div>
                ) : (
                  modalContent[item].node
                );
              }

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
              calInfo={calMonths}
            />
          );
        })}
      </Card.Group>
    </>
  );
};

export default NewCalendar;
