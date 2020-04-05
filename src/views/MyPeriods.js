import React, { useState, useEffect, useRef, createRef } from "react";
import APIManager from "../modules/APIManager";
import PT_CARD from "../components/cards/PT_CARD";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import Set_Card from "../components/cards/Set_Card";
import PT_INPUT from "../components/inputs/PT_INPUT";
import * as moment from "moment";
import * as firebase from "firebase";
import PT_BUFFER from "../components/loader/PT_BUFFER";
import PT_PROGRESS from "../components/loader/PT_PROGRESS";
import { Card, Popup } from "semantic-ui-react";

const MyPeriods = ({ userData, userInfo, setSnackbarObj }) => {
  const [cycles, setCycles] = useState({});
  const [isEditing, setIsEditing] = useState({});
  const [newCycles, setNewCycles] = useState({});
  const [sortedIds, setSortedIds] = useState([]);
  const [longest, setLongest] = useState(0);
  const [newPeriod, setNewPeriod] = useState({
    period_start: moment(),
    period_end: moment(),
  });
  const [averages, setAverages] = useState({
    period: userInfo.averagePeriodDays,
    cycle: userInfo.averageCycleDays,
  });

  const [popup, setPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [isLoading, setIsLoading] = useState({
    loading: false,
    left: 0,
    progress: 0,
  });
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
  useEffect(() => {
    let longest = 0;
    const sortedArray =
      cycles &&
      Object.keys(cycles).sort((a, b) => {
        let days =
          moment(cycles[a].cycle_end, "YYYYY-MM-DD").diff(
            moment(cycles[a].period_start, "YYYY-MM-DD"),
            "days"
          ) + 1;

        longest = days > longest ? days : longest;

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
    setLongest(longest);
    if (JSON.stringify(sortedArray) !== JSON.stringify(sortedIds)) {
      setSortedIds(sortedArray ? sortedArray : []);
      setIsLoading((prevState) => {
        const newObj = { ...prevState };
        newObj.loading = true;
        newObj.progress = newObj.progress + 30;
        return newObj;
      });
    }
  }, [cycles]);

  const getCycles = (num, test) => {
    setIsLoading((prevState) => {
      const newObj = { ...prevState };
      newObj.loading = true;
      newObj.progress = newObj.progress;
      return newObj;
    });
    APIManager.getUserCycles(userData.uid).then((data) => {
      setCycles(data);
      const newObj = {};
      const cycleObj = {};
      const refObj = {};
      for (let id in data) {
        newObj[id] = false;
        cycleObj[id] = {
          period_start: data[id].period_start,
          period_end: data[id].period_end,
        };
      }
      newObj.newPeriod = false;

      setNewCycles(cycleObj);
      setIsEditing(newObj);
      setIsLoading((prevState) => {
        const newObj = { ...prevState };
        newObj.loading = true;
        newObj.progress = newObj.progress + num;
        return newObj;
      });
    });
  };

  const handleChange = (moments, id, time) => {
    const newObj = { ...newCycles };
    if (time == "start") {
      newObj[id].period_start = moments.format("YYYY-MM-DD");
    } else if (time == "end") {
      newObj[id].period_end = moments.format("YYYY-MM-DD");
    } else if (time == "new-start") {
      const newpObj = { ...newPeriod };

      newpObj.period_start = moments.format("YYYY-MM-DD");

      if (cycles) {
        const afterId = sortedIds
          .map(
            (item) =>
              moment(cycles[item].period_start).isAfter(moment(moments)) &&
              sortedIds.indexOf(item)
          )
          .filter((item) => item !== false);

        if (cycles & cycles[sortedIds[afterId.length - 1]]) {
          newpObj.period_end = moment(
            cycles[sortedIds[afterId.length - 1]].period_start
          )
            .subtract(1, "days")
            .format("YYYY-MM-DD");
        }
      }

      setNewPeriod(newpObj);
    } else if (time == "new-end") {
      const newpObj = { ...newPeriod };
      newpObj.period_end = moments.format("YYYY-MM-DD");

      setNewPeriod(newpObj);
    }
    if (id !== "") {
      setNewCycles(newObj);
    }
  };

  const makeKey = (ref) => {
    return firebase.database().ref("cycles").child(userData.uid).push().key;
  };

  const handleClick = (e) => {
    const split = e.currentTarget.id.split("--");
    if (split[0] === "edit") {
      const newObj = { ...isEditing };
      newObj[split[2]] = true;
      setIsEditing(newObj);
    } else if (split[0] === "delete") {
      if (cycles) {
        const afterId = sortedIds
          .map(
            (item) =>
              moment(cycles[item].period_start).isAfter(
                moment(cycles[split[2]].period_end, "YYYY-MM-DD")
              ) && sortedIds.indexOf(item)
          )
          .filter((item) => item !== false);

        const beforeId = sortedIds
          .map(
            (item) =>
              moment(cycles[item].period_start).isBefore(
                moment(cycles[split[2]].period_end, "YYYY-MM-DD")
              ) && sortedIds.indexOf(item)
          )
          .filter((item) => item !== false);

        let nextObj = { period_start: moment().format("YYYY-MM-DD") };
        if (cycles[sortedIds[afterId.length - 1]] !== undefined) {
          nextObj.period_start = moment(
            cycles[sortedIds[afterId.length - 1]].period_start,
            "YYYY-MM-DD"
          )
            .subtract(1, "days")
            .format("YYYY-MM-DD");
        }

        if (cycles[sortedIds[beforeId[0 + 1]]] !== undefined) {
          const prevObj = cycles[sortedIds[beforeId[0 + 1]]];
          prevObj.cycle_end = nextObj.period_start;
          APIManager.updateCycle(
            userData.uid,
            sortedIds[beforeId[0 + 1]],
            prevObj
          ).then(() => {
            getCycles(0, "edited prev cycle");
          });
        }

        APIManager.updateCycle(userData.uid, split[2], {
          period_end: null,
          period_start: null,
          cycle_end: null,
        }).then(() => {
          setSnackbarObj((prevState) => {
            const newObj = { ...prevState };
            newObj.isOpen = true;
            newObj.content = "Cycle Deleted";
            return newObj;
          });
          getCycles(40, "delete cyc;e");
        });
      }
    } else if (split[0] === "submit") {
      if (split[1] == "newPeriod") {
        const newObj = { ...newPeriod };
        newObj.cycle_end = moment().format("YYYY-MM-DD");
        if (cycles) {
          const afterId = sortedIds
            .map(
              (item) =>
                moment(cycles[item].period_start).isAfter(
                  moment(newPeriod.period_end, "YYYY-MM-DD")
                ) && sortedIds.indexOf(item)
            )
            .filter((item) => item !== false);
          if (cycles[sortedIds[afterId.length - 1]]) {
            newObj.cycle_end = moment(
              cycles[sortedIds[afterId.length - 1]].period_start
            )
              .subtract(1, "days")
              .format("YYYY-MM-DD");
          }
        }
        const editingObj = { ...isEditing };
        editingObj[split[2]] = false;
        setIsEditing(editingObj);
        APIManager.updateCycle(userData.uid, makeKey(), newObj).then(() => {
          setSnackbarObj((prevState) => {
            const newObj = { ...prevState };
            newObj.isOpen = true;
            newObj.content = "Cycle Created";
            return newObj;
          });
          getCycles(40, "on submit new period");
        });
      } else {
        const newObj = { ...newCycles[split[2]] };

        if (moment(newCycles[split[2]].period_end).isAfter(moment(), "days")) {
          newObj.period_end = moment(newCycles[split[2]].period_start)
            .add(userInfo.averagePeriodDays, "days")
            .format("YYYY-MM-DD");
          newObj.cycle_end = moment(newCycles[split[2]].period_start)
            .add(userInfo.averageCycleDays, "days")
            .format("YYYY-MM-DD");
        }
        const index = sortedIds.indexOf(split[2]);
        const prevId = sortedIds[index + 1];

        if (prevId !== undefined) {
          APIManager.updateCycle(userData.uid, prevId, {
            cycle_end: moment(newObj.period_start, "YYYY-MM-DD")
              .subtract(1, "days")
              .format("YYYY-MM-DD"),
          }).then(() => {
            getCycles(0, "on editing period with no before");
          });
        }

        const editingObj = { ...isEditing };
        editingObj[split[2]] = false;
        APIManager.updateCycle(userData.uid, split[2], newObj).then(() => {
          getCycles(100, "on editing period with before");
          setSnackbarObj((prevState) => {
            const newObj = { ...prevState };
            newObj.isOpen = true;
            newObj.content = "Cycle Updated";
            return newObj;
          });
        });
        setIsEditing(editingObj);
      }
    } else if (split[0] === "cancel") {
      if (split[1] == "newPeriod") {
        togglePeriod();
      } else {
        const newObj = { ...isEditing };
        newObj[split[2]] = false;
        const valueObj = { ...newCycles };
        valueObj[split[2]].period_start = cycles[split[2]].period_start;
        valueObj[split[2]].period_end = cycles[split[2]].period_end;
        setNewCycles(valueObj);
        setIsEditing(newObj);
      }
    }
  };

  useEffect(() => {
    getCycles(40, "on component mounted");
  }, []);

  const disableStartDays = (date) => {
    for (let prop in cycles) {
      if (
        moment(cycles[prop].period_start, "YYYY-MM-DD").isSameOrBefore(
          moment(date)
        ) &&
        moment(cycles[prop].period_end, "YYYY-MM-DD").isSameOrAfter(
          moment(date)
        )
      ) {
        return true;
      }
    }
  };

  const disableEndDays = (date) => {
    if (moment(date).isBefore(moment(newPeriod.period_start))) {
      return true;
    }

    if (cycles) {
      for (let prop in cycles) {
        if (
          moment(cycles[prop].period_start, "YYYY-MM-DD").isSameOrBefore(
            moment(date)
          ) &&
          moment(cycles[prop].period_end, "YYYY-MM-DD").isSameOrAfter(
            moment(date)
          )
        ) {
          return true;
        }
      }

      const afterId = sortedIds
        .map(
          (item) =>
            moment(cycles[item].period_start).isAfter(
              moment(newPeriod.period_start, "YYYY-MM-DD")
            ) && sortedIds.indexOf(item)
        )
        .filter((item) => item !== false);

      return (
        cycles[sortedIds[afterId.length - 1]] &&
        moment(
          cycles[sortedIds[afterId.length - 1]].period_start,
          "YYYY-MM-DD"
        ).isBefore(moment(date)) &&
        true
      );
    }
  };

  const checkCycles = () => {
    let refreshed = false;
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
          refreshed = true;
          newObj.cycle_end = moment(cycles[item].period_start)
            .subtract(1, "days")
            .format("YYYY-MM-DD");
          APIManager.updateCycle(userData.uid, id, newObj).then(() => {
            getCycles(30, "if cyccles updated in sorted id");
          });
        }
      }
    });

    refreshed == false &&
      setIsLoading((prevState) => {
        const newObj = { ...prevState };
        newObj.progress = newObj.progress + 30;

        return newObj;
      });
  };

  useEffect(() => {
    sortedIds.length > 0 && checkCycles();
  }, [sortedIds]);

  useEffect(() => {
    setAverages({
      period: userInfo.averagePeriodDays,
      cycle: userInfo.averageCycleDays,
    });
  }, [userInfo]);

  const togglePeriod = () => {
    const newObj = { ...isEditing };
    newObj.newPeriod = !newObj.newPeriod;
    setIsEditing(newObj);
  };
  return (
    <>
      {isLoading.loading && <PT_PROGRESS progress={isLoading.progress} />}

      <Popup
        open={popup}
        content={popupContent}
        position="top center"
        pinned
        // context={"asd"}
      />
      <Set_Card
        title="Cycle History"
        path="period&cycle"
        userData={userData}
        userInfo={userInfo}
      />

      <PT_CARD
        groupClass="settings-card-add-period"
        header={isEditing.newPeriod && "New Period"}
        indiv={true}
        extra={
          isEditing.newPeriod ? (
            <>
              <PT_BUTTON
                handleClick={handleClick}
                id={`cancel--newPeriod`}
                icon="delete"
              />
              <PT_BUTTON
                handleClick={handleClick}
                id={`submit--newPeriod`}
                icon="check"
                disabled={
                  moment.isMoment(newPeriod.period_start) ||
                  moment.isMoment(newPeriod.period_end)
                }
              />
            </>
          ) : (
            <PT_BUTTON
              content="Add Period"
              handleClick={togglePeriod}
              icon="plus"
              size="huge"
            />
          )
        }
        description={
          isEditing.newPeriod && (
            <>
              <PT_INPUT
                openTo="date"
                shouldDisableDate={disableStartDays}
                disableFuture={true}
                label="period start"
                type="date"
                handleChange={(moment) => handleChange(moment, "", "new-start")}
                valueFromState={newPeriod.period_start}
              />
              <PT_INPUT
                shouldDisableDate={disableEndDays}
                disableFuture={false}
                label="period end"
                type="date"
                disabled={false}
                handleChange={(moment) => handleChange(moment, "", "new-end")}
                valueFromState={newPeriod.period_end}
              />
            </>
          )
        }
      />

      {sortedIds.length == 0 && (
        <h2>There are no periods logged at this time</h2>
      )}
      <Card.Group stackable centered>
        {sortedIds.length > 0 &&
          cycles &&
          sortedIds.map((item) => {
            const itemIndex = sortedIds.indexOf(item);
            const minDate =
              cycles[sortedIds[itemIndex + 1]] !== undefined &&
              moment(cycles[sortedIds[itemIndex + 1]].period_end, "YYYY-MM-DD")
                .add(1, "days")
                .format("YYYY-MM-DD");

            const maxDate =
              cycles[sortedIds[itemIndex - 1]] !== undefined &&
              moment(
                cycles[sortedIds[itemIndex - 1]].period_start,
                "YYYY-MM-DD"
              )
                .subtract(1, "days")
                .format("YYYY-MM-DD");

            return (
              cycles[item] && (
                <PT_CARD
                  id={item}
                  key={item}
                  extra={
                    !isEditing[item] ? (
                      <>
                        <PT_BUTTON
                          handleClick={handleClick}
                          id={`delete--cycle--${item}`}
                          icon="trash"
                        />
                        <PT_BUTTON
                          handleClick={handleClick}
                          id={`edit--cycle--${item}`}
                          icon="edit"
                        />
                      </>
                    ) : (
                      <>
                        <PT_BUTTON
                          handleClick={handleClick}
                          id={`cancel--cycle--${item}`}
                          icon="delete"
                        />
                        <PT_BUTTON
                          handleClick={handleClick}
                          id={`submit--cycle--${item}`}
                          icon="check"
                        />
                      </>
                    )
                  }
                  header={`${moment(
                    cycles[item].period_start,
                    "YYYY-MM-DD"
                  ).format("MMMM DD, YYYY")}`}
                  meta={
                    <>
                      Cycles Days:{" "}
                      {moment(cycles[item].cycle_end, "YYYY-MM-DD").diff(
                        moment(cycles[item].period_start, "YYYY-MM-DD"),
                        "days"
                      ) + 1}
                      <hr />
                      <PT_BUFFER
                        cycleDays={
                          moment(cycles[item].cycle_end, "YYYY-MM-DD").diff(
                            moment(cycles[item].period_start, "YYYY-MM-DD"),
                            "days"
                          ) + 1
                        }
                        periodDays={
                          moment(cycles[item].period_end, "YYYY-MM-DD").diff(
                            moment(cycles[item].period_start, "YYYY-MM-DD"),
                            "days"
                          ) + 1
                        }
                        longest={longest}
                      />
                    </>
                  }
                  description={
                    isEditing[item] && (
                      <>
                        <PT_INPUT
                          minDate={minDate}
                          maxDate={newCycles[item].period_end}
                          disableFuture={true}
                          label="period start"
                          type="date"
                          handleChange={(moment) =>
                            handleChange(moment, item, "start")
                          }
                          valueFromState={newCycles[item].period_start}
                        />
                        <PT_INPUT
                          minDate={newCycles[item].period_start}
                          maxDate={maxDate}
                          disableFuture={false}
                          label="period end"
                          type="date"
                          disabled={false}
                          handleChange={(moment) =>
                            handleChange(moment, item, "end")
                          }
                          valueFromState={newCycles[item].period_end}
                        />
                      </>
                    )
                  }
                />
              )
            );
          })}
      </Card.Group>
    </>
  );
};

export default MyPeriods;
