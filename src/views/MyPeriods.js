import React, { useState, useEffect } from "react";
import APIManager from "../modules/APIManager";
import PT_CARD from "../components/cards/PT_CARD";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import * as moment from "moment";
import { Card } from "semantic-ui-react";
const MyPeriods = ({ userData, userInfo }) => {
  const [cycles, setCycles] = useState({});
  const [isEditing, setIsEditing] = useState({});

  const getCycles = () => {
    APIManager.getUserCycles(userData.uid).then(data => {
      setCycles(data);
      const newObj = {};
      for (let id in data) {
        newObj[id] = true;
      }
      setIsEditing(newObj);
    });
  };
  const handleClick = e => {
    console.log(e.currentTarget.id);
  };
  useEffect(() => {
    getCycles();
  }, []);
  return (
    <>
      <h1>Overview</h1>
      <h3>{userInfo.averagePeriodDays} Average Period Days</h3>
      <h3>{userInfo.averageCycleDays} Average Cycle Days</h3>
      <Card.Group>
        {Object.keys(cycles).map(item => {
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
              header={`${moment(cycles[item].period_start, "YYYY-MM-DD").format(
                "MMMM DD, YYYY"
              )}`}
              meta={`Cycles Days: ${moment(
                cycles[item].cycle_end,
                "YYYY-MM-DD"
              ).diff(moment(cycles[item].period_start, "YYYY-MM-DD"), "days")}`}
              description={
                isEditing[item] && (
                  <>
                    <input type="text"/>
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
