import React, { useEffect, useState } from "react";
import APIManager from "../modules/APIManager";
import * as moment from "moment";
import PT_CARD from "../components/cards/PT_CARD";
import PT_MENU from "../components/menus/PT_MENU";
import PT_PROGRESS from "../components/loader/PT_PROGRESS";
import PT_FLOAT_BUTTON from "../components/buttons/PT_FLOAT_BUTTON";
import HistoryIcon from "@material-ui/icons/History";

const MyTrends = ({ userData, userInfo, page, history }) => {
  const [cycles, setCycles] = useState({});
  const [cycleTrend, setCycleTrend] = useState(null);
  const [logs, setLogs] = useState({});
  const [currentDay, setCurrentDay] = useState(0);
  const [currentCycle, setCurrentCycle] = useState({});

  const getCycles = () => {
    APIManager.getUserCycles(userData.uid).then((data) => {
      setIsLoading((prevState) => {
        const newObj = { ...prevState };
        newObj.loading = true;
        newObj.progress = newObj.progress + 15;
        return newObj;
      });
      setCycles(data);
    });
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
    setIsLoading((prevState) => {
      const newObj = { ...prevState };
      newObj.loading = true;
      newObj.progress = newObj.progress + 15;
      return newObj;
    });
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
        sameElse: "[For] MMMM Do",
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
        setIsLoading((prevState) => {
          const newObj = { ...prevState };
          newObj.loading = true;
          newObj.progress = newObj.progress + 15;
          return newObj;
        });
      }
    }
  };
  const getLogs = () => {
    let done = { moods: false, flows: false, notes: false };
    APIManager.getResource(`flow_logs/${userData.uid}`).then((data) => {
      const flowObj = data;
      let i = Object.keys(data).length;

      for (let prop in data) {
        APIManager.getResource(`flow_types/${data[prop].flow_typeId}`).then(
          (flowType) => {
            i--;
            flowObj[prop].flow_typeId = flowType.value;
            if (i == 0) {
              done.flows = flowObj;
              setIsLoading((prevState) => {
                const newObj = { ...prevState };
                newObj.loading = true;
                newObj.progress = newObj.progress + 5;
                return newObj;
              });
              if (callIsDone(done)) {
                setLogs(done);
              }
            }
          }
        );
      }
    });
    APIManager.getResource(`mood_logs/${userData.uid}`).then((data) => {
      const moodObj = data;
      let i = Object.keys(data).length;

      for (let prop in data) {
        APIManager.getResource(`mood_types/${data[prop].mood_typeId}`).then(
          (moodType) => {
            i--;
            moodObj[prop].mood_typeId = moodType.icon;
            if (i == 0) {
              done.moods = moodObj;
              setIsLoading((prevState) => {
                const newObj = { ...prevState };
                newObj.loading = true;
                newObj.progress = newObj.progress + 5;
                return newObj;
              });
              if (callIsDone(done)) {
                setLogs(done);
              }
            }
          }
        );
      }
    });

    APIManager.getResource(`note_logs/${userData.uid}`).then((data) => {
      done.notes = data;
      setIsLoading((prevState) => {
        const newObj = { ...prevState };
        newObj.loading = true;
        newObj.progress = newObj.progress + 5;
        return newObj;
      });
      if (callIsDone(done)) {
        setLogs(done);
      }
    });
  };
  const [isLoading, setIsLoading] = useState({
    loading: false,
    left: 0,
    progress: 0,
  });
  useEffect(() => {
    setIsLoading((prevState) => {
      const newObj = { ...prevState };
      newObj.loading = true;
      newObj.progress = 0;
      return newObj;
    });
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
          ] !== undefined &&
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
          ] !== undefined &&
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
          ] &&
            trendObj[
              getCycleDay(cycles[cycle].period_start, logs.notes[prop].date)
            ].notes.push(logs.notes[prop].content);
        }
      }
    }
    codenseCycleTrends(trendObj);
    setIsLoading((prevState) => {
      const newObj = { ...prevState };
      newObj.loading = true;
      newObj.progress = newObj.progress + 15;
      return newObj;
    });
  };

  const arrayLength = (array) => {
    return array.length > 0;
  };

  const codenseCycleTrends = (item) => {
    let index = 0;
    for (let num in item) {
      if (arrayLength(item[num].moods)) {
        let count = {};
        item[num].moods.forEach((mood) => {
          count[mood] = item[num].moods.filter((item) => item == mood).length;
        });
        const ordered = {};
        Object.keys(count)
          .sort((a, b) => count[b] - count[a])
          .forEach((key) => (ordered[key] = count[key]));

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
        ).then((data) => {
          index--;

          item[num].flows = {
            name: data[Object.keys(data)[0]].name,
            icon: data[Object.keys(data)[0]].icon,
          };

          index == 0 && setCycleTrend(item);

          index == 0 &&
            setIsLoading((prevState) => {
              const newObj = { ...prevState };
              newObj.loading = true;
              newObj.progress = newObj.progress + 25;
              return newObj;
            });
        });
      }
    }
  };

  useEffect(() => {
    checkState(logs) && populateCycleTrends();
  }, [logs]);

  useEffect(() => {
    let progressTimer;
    if (isLoading.progress == 100) {
      progressTimer = setTimeout(() => {
        setIsLoading((prevState) => {
          const newObj = { ...prevState };
          newObj.loading = false;
          newObj.progress = 0;
          return newObj;
        });
      }, 500);
    }
    return () => {
      clearTimeout(progressTimer);
    };
  }, [isLoading]);

  const goToToday = () => {
    const rect = document.getElementById(currentDay).getBoundingClientRect();

    window.scrollTo({
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY - 200,
      behavior: "smooth",
    });
  };
  return (
    <>
      {isLoading.loading && <PT_PROGRESS progress={isLoading.progress} />}

      <PT_MENU
        type="tabs"
        path="/trends"
        history={history}
        links={["Analysis", "Everything"]}
      />
      {page == "analysis" && cycleTrend && (
        <>
          <PT_CARD
            indiv={false}
            itemsPerRow={1}
            cardArray={[
              {
                key: "title",
                header: <h1>Today's Analysis</h1>,
              },
              {
                key: "cycle-days",
                header: `Current Cycle Day`,
                description: (
                  <div className="analysis-numbers">{currentDay}</div>
                ),
              },
              {
                key: "cycle",
                header: `Average Cycle Days`,
                description: (
                  <div className="analysis-numbers">
                    {userInfo.averageCycleDays}
                  </div>
                ),
              },
              {
                key: "period",
                header: `Average Period Days`,
                description: (
                  <div className="analysis-numbers">
                    {userInfo.averagePeriodDays}
                  </div>
                ),
              },
              {
                key: "moods",
                header: `Predicted Mood`,
                description: (
                  <div className="analysis-numbers">
                    {Object.keys(cycleTrend[currentDay].moods).length > 0
                      ? Object.keys(cycleTrend[currentDay].moods)
                          .filter((key, i) => {
                            return (
                              cycleTrend[currentDay].moods[key] ==
                              cycleTrend[currentDay].moods[
                                Object.keys(cycleTrend[currentDay].moods)[0]
                              ]
                            );
                          })
                          .map((key) => {
                            return (
                              <img
                                key={key}
                                className="analysis-icon"
                                src={key}
                              />
                            );
                          })
                      : " N/A"}
                  </div>
                ),
              },
              {
                key: "flow",
                header: `Predicted FLow`,
                description: (
                  <div className="analysis-numbers">
                    {cycleTrend[currentDay].flows.icon == undefined ? (
                      "N/A"
                    ) : (
                      <img
                        key="flow-pred"
                        className="analysis-icon"
                        src={cycleTrend[currentDay].flows.icon}
                      />
                    )}
                  </div>
                ),
              },
              {
                key: "notes",
                header: `Notes From Cycle Day`,
                description:
                  cycleTrend[currentDay].notes.length > 0 ? (
                    cycleTrend[currentDay].notes.map((note) => {
                      return (
                        <>
                          <p key={note}>{note}</p> <hr />
                        </>
                      );
                    })
                  ) : (
                    <div className="analysis-numbers">N/A</div>
                  ),
              },
            ]}
          />
        </>
      )}
      {page == "everything" && cycleTrend && (
        <>
          <PT_FLOAT_BUTTON
            size="medium"
            content={
              <>
                <HistoryIcon />
                Today
              </>
            }
            fabClass="trend-float-fab"
            handleClick={goToToday}
          />
          <PT_CARD
            itemsPerRow={3}
            cardArray={Object.keys(cycleTrend)
              .filter((item) => {
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
              .map((item) => {
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
                    description: "No Data for current Day",
                  };
                }
                const topMoods = [];
                const secondMoods = [];
                if (cycleTrend[item].moods.length !== 0) {
                  const arrayReduced = [
                    ...new Set(Object.values(cycleTrend[item].moods)),
                  ];
                  const topMoodCount = arrayReduced[0];
                  const secondCount = arrayReduced[1];

                  Object.keys(cycleTrend[item].moods).forEach((key) => {
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
                          <p>
                            Mood{" "}
                            {topMoods.map((item) => (
                              <img width={"40px"} src={item} />
                            ))}
                          </p>
                          {secondMoods.length > 0 && (
                            <p>
                              Other Moods{" "}
                              {secondMoods.map((item) => (
                                <img width={"40px"} src={item} />
                              ))}
                            </p>
                          )}
                          {(cycleTrend[item].flows.length !== 0 ||
                            cycleTrend[item].notes.length > 0) && <hr />}
                        </>
                      )}
                      {cycleTrend[item].flows.length !== 0 && (
                        <>
                          <p>
                            Flow:{" "}
                            <img
                              width={"20px"}
                              src={cycleTrend[item].flows.icon}
                            />{" "}
                          </p>
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
                  ),
                };
              })}
            indiv={false}
          />
        </>
      )}
    </>
  );
};

const callIsDone = (obj) => {
  return !Object.values(obj).includes(false);
};

const checkState = (obj) => {
  return Object.keys(obj).length > 0;
};

const debounce = (func, wait, immediate) => {
  let timeout;

  return function executedFunction() {
    let context = this;
    let args = arguments;

    let later = function () {
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
