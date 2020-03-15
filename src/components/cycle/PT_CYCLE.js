import React, { useEffect, useState } from "react";

import * as moment from "moment";

const PT_CYCLE = ({ cycleStart, cycleEnd, periodStart, middleText }) => {

  const [cycleDays, setCycleDays] = useState(cycleEnd.diff(cycleStart, "days"));
  const [periodCycleDay, setPeriodStartDay] = useState(cycleDays - cycleEnd.diff(periodStart, "days"))

  useEffect(() => {
    circularText(cycleDays, 150, 0);
  }, [cycleDays]);

  const circularText = (days, radius, classIndex) => {
    let circles = [];
    for (let i = Number(cycleStart.format("DD")); i <= cycleStart.daysInMonth(); i++) {
      circles.push(i);
    }

    for (let i = 1; i <= Number(cycleEnd.format("DD")); i++){
      circles.push(i);
    }

    classIndex = document.getElementsByClassName("circTxt")[classIndex];

    var deg = 360 / circles.length,
      origin = 0;

    circles.forEach((ea, i) => {
      let dotClass = "cycle-dot"
      const tooMany = cycleDays > 33;
      if (i + 1 >= periodCycleDay){
        dotClass += "-red";
      }

      if(tooMany){
        dotClass += "-small"
      }  

      
      
      ea = `<p class="cycleDotContainer" style='height:${radius}px;position:absolute;transform:rotate(${origin}deg);transform-origin:0 100%;'><span class="${dotClass}" style="transform:rotate(-${origin}deg)">${!tooMany ? ea : ""}</span></p>`;
      classIndex.innerHTML += ea;
      origin += deg;
    });
  };

  return (
    <div className="cycleContainer" style={{ "text-align": "center" }}>
      <div className="circleContainer">
        <div className="circTxt" id="test"></div>
      </div>
    </div>
  );
};

export default PT_CYCLE;
