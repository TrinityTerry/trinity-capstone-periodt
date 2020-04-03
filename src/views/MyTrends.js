import React, { useEffect, useState } from "react";
import APIManager from "../modules/APIManager";
import * as moment from "moment";
import PT_CARD from "../components/cards/PT_CARD";
import PT_MENU from "../components/menus/PT_MENU";

const MyTrends = ({ userData, userInfo, page, history }) => {
  const [cycles, setCycles] = useState({});
  const [cycleTrend, setCycleTrend] = useState(null);
  const [logs, setLogs] = useState({});
  const [currentDay, setCurrentDay] = useState(0);
  const [currentCycle, setCurrentCycle] = useState({});

  const getCycles = () => {
    APIManager.getUserCycles(userData.uid).then(setCycles);
  };
  const makeCycleTrends = () => {
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
    const newObj = {};
    for (let i = 1; i <= totalDays; i++) {
      newObj[i] = { moods: [], flows: [], notes: [] };
    }
    setCycleTrend(newObj);
  };
  const dateIsBetween = (date, after, before) => {
    return (
      moment(date, "YYYY-MM-DD").isSameOrAfter(after, "YYYY-MM-DD") &&
      moment(date, "YYYY-MM-DD").isSameOrBefore(before, "YYYY-MM-DD")
    );
  };
  const getCycleDay = (start, date) => {
    return (
      moment(date, "YYYY-MM-DD").diff(moment(start, "YYYY-MM-DD"), "days") + 1
    );
  };
  const getDate = (days, start) => {
    return moment(start, "YYYY-MM-DD")
      .add(Number(days) - 1, "days")
      .calendar(null, {
        sameDay: "[For Today]",
        nextDay: "[For Tomorrow]",
        nextWeek: "[For] dddd",
        lastDay: "[From Yesterday]",
        lastWeek: "[From Last] dddd",
        sameElse: "[For] MMMM Do"
      });
  };
  const getCurrentCycleDay = () => {
    for (let cycle in cycles) {
      if (
        dateIsBetween(
          moment().format("YYYY-MM-DD"),
          cycles[cycle].period_start,
          cycles[cycle].cycle_end
        )
      ) {
        setCurrentCycle(cycles[cycle]);
        setCurrentDay(
          getCycleDay(cycles[cycle].period_start, moment().format("YYYY-MM-DD"))
        );
      }
    }
  };
  const getLogs = () => {
    let done = { moods: false, flows: false, notes: false };
    APIManager.getResource(`flow_logs/${userData.uid}`).then(data => {
      const flowObj = data;
      let i = Object.keys(data).length;

      for (let prop in data) {
        APIManager.getResource(`flow_types/${data[prop].flow_typeId}`).then(
          flowType => {
            i--;
            flowObj[prop].flow_typeId = flowType.value;
            // console.log(flowType);

            if (i == 0) {
              done.flows = flowObj;
              if (callIsDone(done)) {
                setLogs(done);
              }
            }
          }
        );
      }
    });
    APIManager.getResource(`mood_logs/${userData.uid}`).then(data => {
      const moodObj = data;
      let i = Object.keys(data).length;

      for (let prop in data) {
        APIManager.getResource(`mood_types/${data[prop].mood_typeId}`).then(
          moodType => {
            i--;
            moodObj[prop].mood_typeId = moodType.name;
            if (i == 0) {
              done.moods = moodObj;
              if (callIsDone(done)) {
                setLogs(done);
              }
            }
          }
        );
      }
    });

    APIManager.getResource(`note_logs/${userData.uid}`).then(data => {
      done.notes = data;
      if (callIsDone(done)) {
        setLogs(done);
      }
    });
  };

  useEffect(() => {
    getCycles();
  }, []);

  useEffect(() => {
    checkState(cycles) && makeCycleTrends();
    checkState(cycles) && getLogs();
    checkState(cycles) && getCurrentCycleDay();
  }, [cycles]);

  const populateCycleTrends = () => {
    const trendObj = { ...cycleTrend };
    for (let prop in logs.moods) {
      for (let cycle in cycles) {
        if (
          dateIsBetween(
            logs.moods[prop].date,
            cycles[cycle].period_start,
            cycles[cycle].cycle_end
          )
        ) {
          trendObj[
            getCycleDay(cycles[cycle].period_start, logs.moods[prop].date)
          ].moods.push(logs.moods[prop].mood_typeId);
        }
      }
    }

    for (let prop in logs.flows) {
      for (let cycle in cycles) {
        if (
          dateIsBetween(
            logs.flows[prop].date,
            cycles[cycle].period_start,
            cycles[cycle].cycle_end
          )
        ) {
          trendObj[
            getCycleDay(cycles[cycle].period_start, logs.flows[prop].date)
          ].flows.push(logs.flows[prop].flow_typeId);
        }
      }
    }

    for (let prop in logs.notes) {
      for (let cycle in cycles) {
        if (
          dateIsBetween(
            logs.notes[prop].date,
            cycles[cycle].period_start,
            cycles[cycle].cycle_end
          )
        ) {
          trendObj[
            getCycleDay(cycles[cycle].period_start, logs.notes[prop].date)
          ].notes.push(logs.notes[prop].content);
        }
      }
    }
    codenseCycleTrends(trendObj);
  };

  const arrayLength = array => {
    return array.length > 0;
  };
  const codenseCycleTrends = item => {
    let index = 0;
    for (let num in item) {
      if (arrayLength(item[num].moods)) {
        let count = {};
        item[num].moods.forEach(mood => {
          count[mood] = item[num].moods.filter(item => item == mood).length;
        });
        const ordered = {};
        Object.keys(count)
          .sort((a, b) => count[b] - count[a])
          .forEach(key => (ordered[key] = count[key]));
        item[num].moods = ordered;
      }
      if (arrayLength(item[num].flows)) {
        index++;
        const length = item[num].flows.length;
        const reducedFlow = Math.round(
          item[num].flows.reduce((a, b) => a + b) / length
        );
        APIManager.getCustomQuery(
          `flow_types.json?orderBy="value"&equalTo=${reducedFlow}`
        ).then(data => {
          index--;
          item[num].flows = data[Object.keys(data)[0]].name;
          index == 0 && setCycleTrend(item);
        });
      }
    }
  };

  useEffect(() => {
    checkState(logs) && populateCycleTrends();
  }, [logs]);

  useEffect(() => {
    window.addEventListener("hashchange", function() {
      if (document.getElementById(window.location.hash.split("--")[1])) {
        window.scroll({
          top:
            document.getElementById(window.location.hash.split("--")[1])
              .offsetTop - 65,
          left: 500,
          behavior: "smooth"
        });
      }
    });

    window.addEventListener(
      "scroll",
      debounce(() => {
        if (
          document.getElementById(window.location.hash.split("--")[1]) &&
          window.pageYOffset !==
            document.getElementById(window.location.hash.split("--")[1])
              .offsetTop -
              65
        ) {
          if (window.history && window.history.pushState) {
            window.history.pushState("", "", window.location.pathname);
          } else {
            window.location.href = window.location.href.replace(/#.*$/, "#");
          }
        }
      }, 0)
    );
  });
  return (
    <>
      <PT_MENU
        type="tabs"
        path="/trends"
        history={history}
        links={[/* "Today",  */ "Everything"]}
      />
      {page == "everything" && cycleTrend && (
        <>
          <h2>
            <a href={`#day--${currentDay}`}>Go To Today</a>
          </h2>
          <PT_CARD
            itemsPerRow={3}
            cardArray={Object.keys(cycleTrend)
              .filter(item => {
                if (
                  (arrayLength(cycleTrend[item].moods) ||
                    cycleTrend[item].flows.length > 0 ||
                    arrayLength(cycleTrend[item].notes)) &&
                  item <= userInfo.averageCycleDays
                ) {
                  return true;
                } else {
                  if (item == currentDay) {
                    return true;
                  }
                  return false;
                }
              })
              .map(item => {
                if (
                  !(
                    arrayLength(cycleTrend[item].moods) ||
                    cycleTrend[item].flows.length > 0 ||
                    arrayLength(cycleTrend[item].notes)
                  )
                ) {
                  return {
                    key: item,
                    id: item,
                    header: `Cycle Day: ${item}`,
                    extra: <>{item == currentDay && "Today"}</>,
                    description: "No Data for current Day"
                  };
                }
                const topMoods = [];
                const secondMoods = [];
                if (cycleTrend[item].moods.length !== 0) {
                  const arrayReduced = [
                    ...new Set(Object.values(cycleTrend[39].moods))
                  ];
                  const topMoodCount = arrayReduced[0];
                  const secondCount = arrayReduced[1];

                  Object.keys(cycleTrend[item].moods).forEach(key => {
                    if (cycleTrend[item].moods[key] == topMoodCount) {
                      topMoods.push(key);
                    }
                    if (
                      secondCount !== undefined &&
                      cycleTrend[item].moods[key] == secondCount
                    ) {
                      secondMoods.push(key);
                    }
                  });
                }
                console.log();

                return {
                  key: item,
                  id: item,
                  header: `Cycle Day: ${item}`,
                  extra: (
                    <>
                      {`Prediction ${getDate(item, currentCycle.period_start)}`}
                    </>
                  ),
                  description: (
                    <>
                      {topMoods.length !== 0 && (
                        <>
                          <p>Predicted Moods: {topMoods.join(", ")}</p>
                          {secondMoods.length > 0 && (
                            <p>Other Common Moods: {secondMoods.join(", ")}</p>
                          )}
                          {(cycleTrend[item].flows.length !== 0 ||
                            cycleTrend[item].notes.length > 0) && <hr />}
                        </>
                      )}
                      {cycleTrend[item].flows.length !== 0 && (
                        <>
                          <p>Predicted Flow: {cycleTrend[item].flows}</p>
                        </>
                      )}
                      <>
                        {cycleTrend[item].notes.length > 0 && (
                          <>
                            {cycleTrend[item].flows.length !== 0 && <hr />}
                            <div>
                              Notes:{" "}
                              {cycleTrend[item].notes.map((note, i) => {
                                return <p key={i + note}>{note}</p>;
                              })}
                            </div>
                          </>
                        )}
                      </>
                    </>
                  )
                };
              })}
            indiv={false}
          />
        </>
      )}
    </>
  );
};

const callIsDone = obj => {
  return !Object.values(obj).includes(false);
};

const checkState = obj => {
  return Object.keys(obj).length > 0;
};

const debounce = (func, wait, immediate) => {
  let timeout;

  return function executedFunction() {
    let context = this;
    let args = arguments;

    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    let callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};

export default MyTrends;
