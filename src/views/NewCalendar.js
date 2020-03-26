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
  const [logs, setLogs] = useState({});
  const [moods, setMoods] = useState([]);
  const [flows, setFlows] = useState([]);

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
    console.log(e.target.id);
    
  };

  const handleClick = (e, date) => {
    const split = date.split("-");
    const modalContentArray = [];
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
        modalContentArray.push(
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
        modalContentArray.push(
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
        modalContentArray.push(
          <div onClick={handleLog} id={`${prop}--ended`} key={`${prop}--ended`}>
            Period Ended On this Day
            <hr />
          </div>
        );
      }
    }
    APIManager.getLogByDate(userData.uid, "mood", date).then(moodLogs => {
      APIManager.getLogByDate(userData.uid, "note", date).then(noteLogs => {
        APIManager.getLogByDate(userData.uid, "flow", date).then(flowLogs => {
          const moodKeys = Object.keys(moodLogs);
          const noteKeys = Object.keys(noteLogs);
          const flowKeys = Object.keys(flowLogs);


          if (moodKeys.length) {
const moodArray = []
            moodKeys.forEach(item => {
              
              
              moods.forEach((mood, i)=> {
                if(mood.id == moodLogs[item].mood_typeId){
                  moodArray.push({name:mood.name, id:item})

                  
                }
              })
              
              
            });
          }
          if (noteKeys.length) {
            const noteArray = [];
            noteKeys.forEach(item => {
              noteArray.push({content: noteLogs[item].content, id:item});
            });
          }

          if (flowKeys.length) {
            const flowArray = []
            flowKeys.forEach(item => {
               flows.forEach((flow, i)=> {

                if(flow.id == flowLogs[item].flow_typeId){
                  
flowArray.push({name: flow.name, id:item})                   
                  
                }
              })
            });

modalContentArray.push(<h2>Flows</h2>)
            modalContentArray.push(flowArray.map(item => 
  <div onClick={handleLog} id={`${item.id}--ended`} key={`${item.id}--ended`}>
            {item.name}
            <hr />
          </div>
))
          }


                  setModalContent(modalContentArray)
        });
      });
    });
  };

  const handleAction = e => {
    setModalContent([]);
    setOpenModal(false);
  };

  useEffect(() => {
    // getCycles();    
    if(modalContent.length > 0){
      setOpenModal(true)
    } else {
      setOpenModal(false)
    }
    
  }, [modalContent]);

  useEffect(() => {
    getCycles();
  }, [userInfo]);

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
