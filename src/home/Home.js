import React, { useEffect, useState } from "react";
import APIManager from "../api-manager/APIManager";
import * as firebase from "firebase/app";
import * as moment from "moment";
import * as zoneMoment from "moment-timezone";

import "firebase/database";

const Home = ({ userInfo }) => {
  const [hasAllUserInfo, setHasAllUserInfo] = useState(true);
  const [missingUserInfo, setMissingUserInfo] = useState([]);

  useEffect(
    () => {
      if (userInfo !== null) {
        const missingInfoArray = [];
        APIManager.getUserInfo(userInfo.uid).then(data => {
          !data.username && missingInfoArray.push("username");
          !data.first_name && missingInfoArray.push("first_name");
          !data.last_name && missingInfoArray.push("last_name");
          !data.created_at && missingInfoArray.push("created_at");
          !data.time_zone && missingInfoArray.push("time_zone");
          !data.is_active && missingInfoArray.push("is_active");
          setMissingUserInfo(missingInfoArray);
          missingInfoArray.length > 0 && setHasAllUserInfo(false);
        });
      }
    },
    //   console.log(moment().format("ddd, D MMM YYYY hh:mm:ss"));
    //   console.log("Fri, 13 Mar 2020 16:36:37 CST");
    [userInfo]
  );

//   useEffect(() => {
//     if (!hasAllUserInfo) {
      
//       //   .then(data => console.log(data));

//       // APIManager.createNewUser(userInfo.uid);
//     }
//   }, [hasAllUserInfo]);

  return (
    <>
      <input type="text"></input>
    </>
  );
};

export default Home;
// "Fri, 13 Mar 2020 21:36:37 GMT"
