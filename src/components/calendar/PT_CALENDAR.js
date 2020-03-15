import React, { useState, useEffect } from "react";
import * as moment from "moment";
import { Grid, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

const PT_CALENDAR = ({ date, highlight }) => {
  const [daySquares, setDaySquares] = useState(["square"]);
  const [dayGrid, setDayGrid] = useState(["monday"]);

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
      // console.log(highlight);

      newArray.push(
        highlight.indexOf(`${i}`) > -1 ? (
          <Grid.Column textAlign={"center"} verticalAlign={"middle"} className="grid-background-color" key={i + 7}>
            <Link to={date + `-${i}`}>{`${i}`}</Link>
          </Grid.Column>
        ) : (
          <Grid.Column textAlign={"center"} verticalAlign={"middle"} key={i + 7}>
            <Link to={date + `-${i}`}>{`${i}`}</Link>
          </Grid.Column>
        )
      );
    }

    let newDayGridArray = [];
    for (var i = 0; i < dayNames.length; i++) {
      newDayGridArray.push(
        <Grid.Column textAlign={"center"} verticalAlign={"middle"} key={dayNames[i]}>{`${dayNames[i].slice(
          0,
          3
        )}`}</Grid.Column>
      );
    }
    setDayGrid(newDayGridArray);
    setDaySquares(newArray);
  }, []);

  return (
    <>
      <h1>{moment(date, "YYYY-MM").format("MMMM YYYY")}</h1>
      <Grid columns={7} celled="internally" padded>
        <Grid.Row>{dayGrid.map(square => square)}</Grid.Row>

        <Grid.Row>{daySquares.map(square => square)}</Grid.Row>
      </Grid>
    </>
  );
};

export default PT_CALENDAR;
