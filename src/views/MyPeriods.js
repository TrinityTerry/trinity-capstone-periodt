import React, { useState, useEffect } from "react";
import APIManager from "../modules/APIManager";
import PT_CARD from "../components/cards/PT_CARD";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_INPUT from "../components/inputs/PT_INPUT";
import * as moment from "moment";
import * as firebase from "firebase";
import PT_LOADER from "../components/loader/PT_LOADER"

import { Card, Popup} from "semantic-ui-react";

const MyPeriods = ({ userData, userInfo }) => {
  const [cycles, setCycles] = useState({});
  const [isEditing, setIsEditing] = useState({});
  const [newCycles, setNewCycles] = useState({});
  const [sortedIds, setSortedIds] = useState([]);
  const [newPeriod, setNewPeriod] = useState({
    period_start: moment(),
    period_end: moment()
  });
  const [isLoading, setIsLoading] = useState(true);

  const [popup, setPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");

  useEffect(() => {
    firebase
      .database()
      .ref("cycles")
      .child(userData.uid)
      .on("child_removed", () => {
        getCycles();
      });

    firebase
      .database()
      .ref("cycles")
      .child(userData.uid)
      .on("child_changed", () => {
        getCycles();
      });

    firebase
      .database()
      .ref("cycles")
      .on("child_changed", snapshot => {
        getCycles();
      });
  });

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

  const getCycles = () => {
    setIsLoading(true);
    APIManager.getUserCycles(userData.uid).then(data => {
      setCycles(data);
      const newObj = {};
      const cycleObj = {};
      for (let id in data) {
        newObj[id] = false;
        cycleObj[id] = {
          period_start: data[id].period_start,
          period_end: data[id].period_end
        };
      }
      newObj.newPeriod = false;

      setNewCycles(cycleObj);
      setIsEditing(newObj);
      setIsLoading(false);
    });
  };
  const handleChange = (moments, id, time) => {
    const newObj = { ...newCycles };
    if (time === "start") {
      newObj[id].period_start = moments.format("YYYY-MM-DD");
    } else if (time === "end") {
      newObj[id].period_end = moments.format("YYYY-MM-DD");
    } else if (time == "new-start") {
      const newpObj = { ...newPeriod };

      newpObj.period_start = moments.format("YYYY-MM-DD");

      const afterId = sortedIds
        .map(
          item =>
            moment(cycles[item].period_start).isAfter(moment(moments)) &&
            sortedIds.indexOf(item)
        )
        .filter(item => item !== false);

      if (cycles & cycles[sortedIds[afterId.length - 1]]) {
        newpObj.period_end = moment(
          cycles[sortedIds[afterId.length - 1]].period_start
        )
          .subtract(1, "days")
          .format("YYYY-MM-DD");
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

  const makeKey = ref => {
    return firebase
      .database()
      .ref("cycles")
      .child(userData.uid)
      .push().key;
  };

  const handleClick = e => {
    const split = e.currentTarget.id.split("--");
    if (split[0] === "edit") {
      const newObj = { ...isEditing };
      newObj[split[2]] = true;
      setIsEditing(newObj);
    } else if (split[0] === "delete") {
      if (cycles) {
        const afterId = sortedIds
          .map(
            item =>
              moment(cycles[item].period_start).isAfter(
                moment(cycles[split[2]].period_end, "YYYY-MM-DD")
              ) && sortedIds.indexOf(item)
          )
          .filter(item => item !== false);

        const beforeId = sortedIds
          .map(
            item =>
              moment(cycles[item].period_start).isBefore(
                moment(cycles[split[2]].period_end, "YYYY-MM-DD")
              ) && sortedIds.indexOf(item)
          )
          .filter(item => item !== false);
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
          );
        }
      }
      APIManager.updateCycle(userData.uid, split[2], {
        period_end: null,
        period_start: null,
        cycle_end: null
      });
    } else if (split[0] === "submit") {
      if (split[1] == "newPeriod") {
        const newObj = { ...newPeriod };
        newObj.cycle_end = moment().format("YYYY-MM-DD");
        if (cycles) {
          const afterId = sortedIds
            .map(
              item =>
                moment(cycles[item].period_start).isAfter(
                  moment(newPeriod.period_end, "YYYY-MM-DD")
                ) && sortedIds.indexOf(item)
            )
            .filter(item => item !== false);
          if (cycles[sortedIds[afterId.length - 1]]) {
            newObj.cycle_end = moment(
              cycles[sortedIds[afterId.length - 1]].period_start
            )
              .subtract(1, "days")
              .format("YYYY-MM-DD");
          }
        }

        APIManager.updateCycle(userData.uid, makeKey(), newObj);
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
              .format("YYYY-MM-DD")
          });
        }
        const editingObj = { ...isEditing };
        editingObj[split[2]] = false;
        APIManager.updateCycle(userData.uid, split[2], newObj);
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
    getCycles();
  }, []);

  const disableStartDays = date => {
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

  const disableEndDays = date => {
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
          item =>
            moment(cycles[item].period_start).isAfter(
              moment(newPeriod.period_start, "YYYY-MM-DD")
            ) && sortedIds.indexOf(item)
        )
        .filter(item => item !== false);

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

  const togglePeriod = () => {
    const newObj = { ...isEditing };
    newObj.newPeriod = !newObj.newPeriod;
    setIsEditing(newObj);
  };
  return (
    <>
    <PT_LOADER active={isLoading} />
      {/* <Dimmer active={isLoading}>
        <Loader />
      </Dimmer> */}
      <Popup
        open={popup}
        content={popupContent}
        position="top center"
        pinned
      />

      <h1>Overview</h1>
      <h3>{userInfo.averagePeriodDays} Average Period Days</h3>
      <h3>{userInfo.averageCycleDays} Average Cycle Days</h3>
      <Card.Group stackable>
        <PT_CARD
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
                  handleChange={moment => handleChange(moment, "", "new-start")}
                  valueFromState={newPeriod.period_start}
                />
                <PT_INPUT
                  shouldDisableDate={disableEndDays}
                  disableFuture={false}
                  label="period end"
                  type="date"
                  disabled={false}
                  handleChange={moment => handleChange(moment, "", "new-end")}
                  valueFromState={newPeriod.period_end}
                />
              </>
            )
          }
        />

        {sortedIds.length == 0 && (
          <h2>There are no periods logged at this time</h2>
        )}

        {sortedIds.length > 0 &&
          cycles &&
          sortedIds.map(item => {
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
                  meta={`Cycles Days: ${moment(
                    cycles[item].cycle_end,
                    "YYYY-MM-DD"
                  ).diff(
                    moment(cycles[item].period_start, "YYYY-MM-DD"),
                    "days"
                  )}`}
                  description={
                    isEditing[item] && (
                      <>
                        <PT_INPUT
                          minDate={minDate}
                          maxDate={newCycles[item].period_end}
                          disableFuture={true}
                          label="period start"
                          type="date"
                          handleChange={moment =>
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
                          handleChange={moment =>
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
