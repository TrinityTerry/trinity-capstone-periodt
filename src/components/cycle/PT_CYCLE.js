import React, { useEffect, useState } from "react";
import PT_BUTTON from "../buttons/PT_BUTTON";

import * as moment from "moment";

const PT_CYCLE = ({
  periodStart,
  predictedCycleEnd,
  periodEnd,
  showDate = true,
  dots = "normal",
  showPeriod = true,
  handleButtonClick,
  averageCycleLength,
  middleMonths,
  nextPeriod
}) => {
  const [viewDate, setViewDate] = useState(moment());
  const [viewCycleDay, setViewCycleDay] = useState(
    viewDate.diff(periodStart, "days") + 1
    );

  const [cycleDays, setCycleDays] = useState(
      predictedCycleEnd.diff(periodStart, "days") + 1
      );

      const [currentCycleDay, setCurrentCycleDay] = useState(
        moment().diff(periodStart, "days") + 1
        );

        const [periodEndDay, setPeriodEndDay] = useState(
          periodEnd.diff(periodStart, "days") + 1
          );

          const [circleInfo, setCircleInfo] = useState([]);
          // const [cycle, setCircleInfo] = useState([]);



  useEffect(() => {
    circularText(cycleDays, 150, 0);
  }, [viewDate]);


  const handleClick = (e, date) => {
    setViewDate(moment(date, "YYYY-MM-DD"));
    setViewCycleDay(moment(date, "YYYY-MM-DD").diff(periodStart, "days") + 1)
  }

  const circularText = (days, radius, classIndex) => {
    
    let circles = [];

    for (
      let i = Number(periodStart.format("DD"));
      i <= periodStart.daysInMonth();
      i++
    ) {

      if(`${viewDate.format("MM")}, ${viewDate.format("DD")}` ===`${periodStart.format("MM")}, ${i < 10 ? `0${i}` : `${i}`}`){
        
        circles.push([
          i,
          periodStart.format("YYYY-MM-" + i),
          periodStart.format("MMM"),
          i
        ]);
      } else if (Number(periodStart.format("DD")) === i) {
        circles.push([
          i,
          periodStart.format("YYYY-MM-" + i),
          periodStart.format("MMM"),
          i
        ]);
      } else {
        circles.push([i, periodStart.format("YYYY-MM-" + i)]);
      }
    }

    if (middleMonths > 2) {
      let addMonth = 0
      for (let j = middleMonths; j > 1; j--) {
        
        const month = moment().startOf("month").add(addMonth++, "months")
        for (let i = 1; i <= month.daysInMonth(); i++) {
          if(`${viewDate.format("MM")}, ${viewDate.format("DD")}` === `${month.format("MM")}, ${i < 10 ? `0${i}` : `${i}`}`){
        
            circles.push([
              i,
              month.format("YYYY-MM-" + i),
              month.format("MMM"),
              i
            ]);
          } else if (i === 1) {
            circles.push([
              i,
              month.format("YYYY-MM-") + i,
              month.format("MMM")
            ]);
          } else {
            circles.push([i, month.format("YYYY-MM-") + i]);
          }
        }
      }
    }

    if (middleMonths > 1) {
      for (let i = 1; i <= Number(predictedCycleEnd.format("DD")); i++) {
        if(`${viewDate.format("MM")}, ${viewDate.format("DD")}` === `${predictedCycleEnd.format("MM")}, ${i < 10 ? `0${i}` : `${i}`}`){
        
          circles.push([
            i,
            predictedCycleEnd.format("YYYY-MM-" + i),
            predictedCycleEnd.format("MMM"),
            i
          ]);
        } else if (i === 1) {
          circles.push([
            i,
            predictedCycleEnd.format("YYYY-MM-") + i,
            predictedCycleEnd.format("MMM")
          ]);
        } else {
          circles.push([i, predictedCycleEnd.format("YYYY-MM-") + i]);
        }
      }
    }

    var deg = 360 / circles.length,
      origin = 0;
    let circleInfo = [];

    circles.forEach((ea, i) => {
  
      let dotClass = "cycle-dot";
      const tooMany = cycleDays > 28;

      if (i + 1 === currentCycleDay) {
        dotClass += "-currentday";
      } else if (i + 1 <= periodEndDay) {
        dotClass += "-red";
      }

      if (tooMany || dots === "small") {
        dotClass += "-small";
      }

      if (viewCycleDay !== currentCycleDay) {
        if (i + 1 === viewCycleDay) {
          dotClass += "-selected";
        }
      }

      circleInfo.push({
        radius: radius,
        origin: origin,
        dotClass: dotClass,
        tooMany:tooMany,
        ea: ea
      });
      origin += deg;
    });

    setCircleInfo(circleInfo);
  };

  return (
    <div className="cycleContainer" style={{ textAlign: "center" }}>
      <div className="circleContainer">
        <div className="cycleText">
          {viewDate.format("MMMM DD") === moment().format("MMMM DD") && <div>{viewDate.format("MMMM DD")}</div>}
          <div >Cycle Day</div>
          <div className="cycleText-cycle-number">{viewCycleDay}</div>
          {showPeriod && (viewCycleDay < periodEndDay ? `Period should end in ${periodEndDay - viewCycleDay} days` : viewCycleDay === periodEndDay ? "Period should end today" : "Next Period: " + nextPeriod)}
          {viewCycleDay > averageCycleLength &&
            `Your period is late by ${viewCycleDay - averageCycleLength - 1} days`}
            {viewDate.format("MMMM DD") !== moment().format("MMMM DD") && <PT_BUTTON
        icon={'calendar'}
        handleClick={(e) => handleClick(e, moment())}
        circular={true}
        content="today"
        
      /> }
          
        </div>
        <div className="circTxt" id="test">
          {circleInfo.map((info, index) => (
            <div
              key={index}
              className="cycleDotContainer"
              style={{
                height: `${info.radius}px`,
                position: "absolute",
                transform: `rotate(${info.origin}deg)`,
                transformOrigin: "0 100%"
              }}
            >
              <div className="cycle-dot-padding" onClick={(e) => handleClick(e, info.ea[1])}>
                <span
                  className={`${info.dotClass}`}
                  style={{ transform: `rotate(-${info.origin}deg)` }}
                  
                >
                  {dots !== "small" && !info.tooMany ? (
                    <>
                      <span className="cycle-dot-month">
                        {info.ea[3] && index !== currentCycleDay - 1 && info.ea[2]}
                      </span>
                      <span
                        className={
                          info.ea[3]
                            ? "cycle-dot-number-first"
                            : "cycle-dot-number"
                        }
                      >
                        {info.ea[2]
                          ? info.ea[3]
                            ? info.ea[3]
                            : ""
                          : info.ea[0]}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={
                          index == 0
                            ? "cycle-dot-month-first"
                            : "cycle-dot-month"
                        }>
                        {info.ea[3] && index !== currentCycleDay - 1 && info.ea[2]}
                      </span>
                      <span
                        className={
                          info.ea[3] && index !== currentCycleDay - 1
                            ? "cycle-dot-number-first"
                            : "cycle-dot-number"
                        }
                      >
                        {info.ea[3] && index !== currentCycleDay - 1 && info.ea[3]}
                      </span>
                    </>
                  )}
                </span>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PT_CYCLE;
