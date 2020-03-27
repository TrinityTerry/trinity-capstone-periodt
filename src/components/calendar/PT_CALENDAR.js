import React, { useState, useEffect } from "react";
import * as moment from "moment";
import { Grid } from "semantic-ui-react";
import { Link } from "react-router-dom";
import PT_CARD from "../cards/PT_CARD";

const PT_CALENDAR = ({
  calInfo,
  date,
  highlight = [],
  groupClass,
  handleClick,
  endPeriodDay = [],
  startPeriodDay = [],
  predictStart = [],
  predictEnd = [],
  logDays = []
}) => {
  const [daySquares, setDaySquares] = useState(["square"]);
  const [dayGrid, setDayGrid] = useState(["monday"]);
  const [month, setMonth] = useState("");

  useEffect(() => {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    const days = moment(date, "YYYY-MM").daysInMonth();

    const startDay = dayNames.indexOf(
      moment(date, "YYYY-MM")
        .startOf("month")
        .format("dddd")
    );

    let newArray = [];

    for (let i = 1; i <= startDay; i++) {
      newArray.push(<Grid.Column key={i}>{``}</Grid.Column>);
    }

    for (let i = 1; i <= days; i++) {
      let touched = false;

      startPeriodDay.forEach((element, j) => {
        if (i >= startPeriodDay[j] && i <= endPeriodDay[j]) {
          newArray.push(
            <Grid.Column
              textAlign={"center"}
              verticalAlign={"middle"}
              className={
                logDays.includes(`${i < 10 ? `0${i}` : `${i}`}`)
                  ? moment().isSame(moment(date, "YYYY-MM"), "month") &&
                    i == moment().format("D")
                    ? "established-period calendar-number-square today-selected show-log"
                    : "established-period calendar-number-square show-log"
                  : moment().isSame(moment(date, "YYYY-MM"), "month") &&
                    i == moment().format("D")
                  ? "established-period today-selected calendar-number-square"
                  : "established-period calendar-number-square"
              }
              key={i + 7}
            >
              <div
                onClick={e => handleClick(e, date + `-${i < 10 ? "0" + i : i}`)}
              >{`${i}`}</div>
            </Grid.Column>
          );
          touched = true;
        }
      });

      predictStart.forEach((element, j) => {
        if (i >= predictStart[j] && i <= predictEnd[j]) {
          newArray.push(
            <Grid.Column
              textAlign={"center"}
              verticalAlign={"middle"}
              className="calendar-number-square predicted-period"
              key={i + 7}
            >
              <div
                onClick={e => handleClick(e, date + `-${i < 10 ? "0" + i : i}`)}
              >{`${i}`}</div>
            </Grid.Column>
          );
          touched = true;
        }
      });

      if (
        moment().isSame(moment(date, "YYYY-MM"), "month") &&
        i == moment().format("D") &&
        !touched
      ) {
        console.log("hapened", i);

        newArray.push(
          <Grid.Column
            textAlign={"center"}
            verticalAlign={"middle"}
            className="calendar-number-square today-selected"
            key={"today"}
          >
            <div
              onClick={e => handleClick(e, date + `-${i < 10 ? "0" + i : i}`)}
            >{`${i}`}</div>
          </Grid.Column>
        );
        touched = true;
      }

      // logDays.forEach((element, j) => {
      //   // console.log(i == element);

      //   if (i == element) {
      //     newArray.push(
      //       <Grid.Column
      //         textAlign={"center"}
      //         verticalAlign={"middle"}
      //         className="calendar-number-square show-log"
      //         key={i + 7}
      //       >
      //         <div
      //           onClick={e => handleClick(e, date + `-${i < 10 ? "0" + i : i}`)}
      //         >{`${i}`}</div>
      //       </Grid.Column>
      //     );
      //     touched = true;
      //   }
      // });

      if (!touched) {
        newArray.push(
          <Grid.Column
            textAlign={"center"}
            verticalAlign={"middle"}
            className={
              logDays.includes(`${i < 10 ? `0${i}` : `${i}`}`)
                ? "calendar-number-square show-log"
                : " calendar-number-square"
            }
            key={i + 7}
          >
            <div
              onClick={e => handleClick(e, date + `-${i < 10 ? "0" + i : i}`)}
            >{`${i}`}</div>
          </Grid.Column>
        );
      }
    }

    let newDayGridArray = [];
    for (var i = 0; i < dayNames.length; i++) {
      newDayGridArray.push(
        <Grid.Column
          textAlign={"center"}
          verticalAlign={"middle"}
          className="calendar-name-square"
          key={dayNames[i]}
        >{`${dayNames[i].slice(0, 3)}`}</Grid.Column>
      );
    }
    setDayGrid(newDayGridArray);
    setDaySquares(newArray);
  }, [calInfo]);

  return (
    <PT_CARD
      cardArray={[
        {
          children: (
            <div className="calendar-container">
              <h1>{moment(date, "YYYY-MM").format("MMMM YYYY")}</h1>
              <Grid columns={7} celled="internally" padded>
                <Grid.Row>{dayGrid.map(square => square)}</Grid.Row>

                <Grid.Row>{daySquares.map(square => square)}</Grid.Row>
              </Grid>
            </div>
          )
        }
      ]}
      indiv={false}
      groupClass={groupClass}
    />
  );
};

export default PT_CALENDAR;
