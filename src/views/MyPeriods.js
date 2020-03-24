import React, { useState, useEffect, useRef, createRef } from "react";
import APIManager from "../modules/APIManager";
import PT_CARD from "../components/cards/PT_CARD";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_INPUT from "../components/inputs/PT_INPUT";
import * as moment from "moment";
import * as firebase from "firebase";
import { Card, Popup } from "semantic-ui-react";

const MyPeriods = ({ userData, userInfo }) => {
  const [cycles, setCycles] = useState({});
  const [isEditing, setIsEditing] = useState({});
  const [newCycles, setNewCycles] = useState({});
  const [sortedIds, setSortedIds] = useState([]);

  const [popup, setPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");

  useEffect(() => {
    firebase
      .database()
      .ref("cycles")
      .child(userData.uid)
      .on("child_removed", snapshot => {
        getCycles();
        console.log("changed");
      });

    firebase
      .database()
      .ref("cycles")
      .child(userData.uid)
      .on("child_changed", snapshot => {
        getCycles();
        console.log("changed");
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
    APIManager.getUserCycles(userData.uid).then(data => {
      setCycles(data);
      const newObj = {};
      const cycleObj = {};
      const refObj = {};
      for (let id in data) {
        newObj[id] = false;
        cycleObj[id] = {
          period_start: data[id].period_start,
          period_end: data[id].period_end
        };
      }

      setNewCycles(cycleObj);
      setIsEditing(newObj);
    });
  };
  const handleChange = (moments, id, time) => {
    const newObj = { ...newCycles };
    if (time == "start") {
      newObj[id].period_start = moments.format("YYYY-MM-DD");
    } else if (time == "end") {
      newObj[id].period_end = moments.format("YYYY-MM-DD");
    }
    setNewCycles(newObj);
  };

  const handleClick = e => {
    const split = e.currentTarget.id.split("--");
    if (split[0] === "edit") {
      const newObj = { ...isEditing };
      newObj[split[2]] = true;

      setIsEditing(newObj);
    } else if (split[0] === "delete") {
      APIManager.updateCycle(userData.uid, split[2], {
        period_end: null,
        period_start: null,
        cycle_end: null
      });
    } else if (split[0] === "submit") {
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

      APIManager.updateCycle(userData.uid, split[2], newObj);
    } else if (split[0] === "cancel") {
      const newObj = { ...isEditing };
      newObj[split[2]] = false;
      const valueObj = { ...newCycles };
      valueObj[split[2]].period_start = cycles[split[2]].period_start;
      valueObj[split[2]].period_end = cycles[split[2]].period_end;
      setNewCycles(valueObj);
      setIsEditing(newObj);
    }
  };
  useEffect(() => {
    getCycles();
  }, []);
  return (
    <>
      <Popup
        open={popup}
        content={popupContent}
        position="top center"
        pinned
        // context={"asd"}
      />

      <h1>Overview</h1>
      <h3>{userInfo.averagePeriodDays} Average Period Days</h3>
      <h3>{userInfo.averageCycleDays} Average Cycle Days</h3>
      <Card.Group stackable>
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
            );
          })}
      </Card.Group>
    </>
  );
};

export default MyPeriods;
