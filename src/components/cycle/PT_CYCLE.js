import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import PT_BUTTON from "../buttons/PT_BUTTON"

import * as moment from "moment";

const PT_CYCLE = ({ cycleStart, predictedCycleEnd, predictedPeriodStart, showDate = true,  dots = "normal", showPeriod=true, handleButtonClick}) => {

  const [cycleDays, setCycleDays] = useState(predictedCycleEnd.diff(cycleStart, "days"));
  const [currentCycleDay, setCurrentCycleDay] = useState(moment().diff(cycleStart, "days"))
  const [periodCycleDay, setPeriodStartDay] = useState(cycleDays - predictedCycleEnd.diff(predictedPeriodStart, "days"))
  const [circleInfo, setCircleInfo] = useState([]);

  useEffect(() => {
    circularText(cycleDays, 150, 0);
  }, []);

  const circularText = (days, radius, classIndex) => {
    let circles = [];

    for (let i = Number(cycleStart.format("DD")); i <= cycleStart.daysInMonth(); i++) {
      // console.log(cycleStart.format("DD"));
      if(Number(cycleStart.format("DD")) == i){
        circles.push([i, cycleStart.format("YYYY-MM-" + i), cycleStart.format("MMM"), i]);
      } else {
        circles.push([i, cycleStart.format("YYYY-MM-" + i)]);
      }
    }
  const middleMonths = predictedCycleEnd.diff(cycleStart, "months", true);

  const cycleMonth = cycleStart.add(1, 'months');

    if(middleMonths > 1){
      for(let j = middleMonths; j > 1; j--){
        
        for (let i = 1; i <= cycleMonth.daysInMonth(); i++) {          
          if(i == 1){
            circles.push([i, cycleMonth.format("YYYY-MM-") + i, cycleStart.format("MMM")]);
          } else {
            circles.push([i, cycleMonth.format("YYYY-MM-") + i]);
          }
          
        }
      }  
    }

if(predictedCycleEnd.diff(cycleStart, "months") > 0){
  
    for (let i = 1; i <= Number(predictedCycleEnd.format("DD")); i++){
        console.log(cycleStart.format("DD"));
      if(i == 1){
        circles.push([i, predictedCycleEnd.format("YYYY-MM-") + i, predictedCycleEnd.format("MMM")]);
      } else {
        circles.push([i, predictedCycleEnd.format("YYYY-MM-") + i]);
      }
    }
}


    var deg = 360 / circles.length,
      origin = 0;
      let circleInfo = [];

      circles.forEach((ea, i) => {
        let dotClass = "cycle-dot"
        const tooMany = cycleDays > 100;

        if(i == currentCycleDay){
            dotClass += "-currentday";

        } else if (i + 1 >= periodCycleDay){
          dotClass += "-red";
        }

        if(tooMany || dots == "small"){
          dotClass += "-small"
        }  

        circleInfo.push({
          radius: radius,
          origin: origin,
          dotClass: dotClass,
          tooMany, tooMany,
          ea: ea,

        })
        origin += deg;
      });

      setCircleInfo(circleInfo);
  };

  return (
    <div className="cycleContainer" style={{ "textAlign": "center"}}>
      <div className="circleContainer">
          <div className="cycleText">
            {showDate && <div>{moment().format("MMMM DD")}</div>}
            {showPeriod && "Period on: " + predictedPeriodStart.calendar()}
            <div>Cycle Day: {currentCycleDay}</div>
            <PT_BUTTON content="Add Log" handleClick={handleButtonClick}/>
          </div>
          <div className="circTxt" id="test">
            {circleInfo.map((info, i) => 
              <p key={i} className="cycleDotContainer" style={{"height":`${info.radius}px`, "position":"absolute", "transform":`rotate(${info.origin}deg)`,"transformOrigin":"0 100%"}}>
              <Link to={"/" + info.ea[1]}>
              <span className={`${info.dotClass}`} style={{"transform":`rotate(-${info.origin}deg)`}}>
                   {dots !== "small" && !info.tooMany ? 
                    <>
                      <span className="cycle-dot-month">{info.ea[2] && info.ea[2]}</span> 
                      <span className={info.ea[3] ? "cycle-dot-number-first" : "cycle-dot-number"}>{info.ea[2] ? (info.ea[3] ?  info.ea[3] : "" ):info.ea[0]}</span> 
                    </>: ""}
                  </span>
                  </Link>
                  
              </p>
            )}
          </div>
      </div>
    </div>
  );
};

export default PT_CYCLE;
