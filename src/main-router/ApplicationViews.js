import React, { useState, useEffect } from "react";
import { Route, useHistory, Switch, Redirect } from "react-router-dom";
import * as firebase from "firebase";
import Home from "../views/Home";
import Auth from "../views/Login";
import MyLogs from "../views/MyLogs";
import NewCalendar from "../views/NewCalendar";
import AddLog from "../views/AddLog";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_MENU from "../components/menus/PT_MENU";
import PT_MODAL from "../components/modals/PT_MODAL";

import APIManager from "../modules/APIManager";
import * as moment from "moment";

const ApplicationViews = props => {
  const [userInfo, setUserInfo] = useState(null);
  const [userData, setUserData] = useState(null);
  const [history] = useState(useHistory());
  const [missingUserInfo, setMissingUserInfo] = useState([]);
  const [missingUserData, setMissingUserData] = useState(null);
  const [isOnPeriod, setIsOnPeriod] = useState(false);
  const [cycles, setCycles] = useState(null);
  const [currentCycle, setCurrentCycle] = useState(null);
  const [periodButton, setPeriodButton] = useState(false);
  const [endPeriodContent, setEndPeriodContent] = useState({
    header: "",
    main: ""
  });
  const [openEndPeriodModal, setOpenEndPeriodModal] = useState(false);

  const updateCycle = () => {
    const newObj = { ...currentCycle.cycleData };
    newObj.period_end = moment().format("YYYY-MM-DD");
    APIManager.updateCycle(userData.uid, currentCycle.cycleId, newObj);
  };

  const handleEndPeriodModal = e => {
    if (e.target.value == "submit") {
      updateCycle();
      setOpenEndPeriodModal(false);
    } else {
      // delete period log
      // update current cycle
    }
  };

  const refreshUser = () => {
    var user = firebase.auth().currentUser;
    if (user) {
      APIManager.getUserInfo(user.uid)
        .then(data => data[user.uid])
        .then(setUserInfo);
        
        alert("User!");
        
    } else {
      console.log("no user");
      
    }
  };

  const getLogs = () => {
    let newObj = {};
    return APIManager.getResource(`mood_logs/${userData.uid}`).then(data => {
      newObj.mood_logs = data;
      APIManager.getResource(`flow_logs/${userData.uid}`).then(flowData => {
        newObj.flow_logs = flowData;
        APIManager.getResource(`note_logs/${userData.uid}`)
          .then(noteData => {
            newObj.note_logs = noteData;
            return newObj;
          })
          .then(data => data);
      });
    });
  };

  const getCycles = () => {
    if (userData) {
      APIManager.getUserCycles(userData.uid).then(data => {
        if (data == null || Object.keys(data).length == 0) {
          const emptyObj = {
            cycleData: {
              cycle_end: moment().format("YYYY-MM-DD"),
              period_end: moment().format("YYYY-MM-DD"),
              period_start: moment().format("YYYY-MM-DD")
            }
          };
          setCurrentCycle(emptyObj);
        } else {
          let cycleEndDates = [];

          for (let cycle in data) {
            cycleEndDates.push({ cycleData: data[cycle], cycleId: cycle });
          }
          const allCycles = cycleEndDates;
          cycleEndDates.sort(
            (a, b) =>
              moment(b.cycleData.cycle_end, "YYYY-MM-DD").format("YYYYMMDD") -
              moment(a.cycleData.cycle_end, "YYYY-MM-DD").format("YYYYMMDD")
          );
          setCurrentCycle(cycleEndDates[0]);
          if (
            moment(cycleEndDates[0].cycleData.cycle_end, "YYYY-MM-DD").isBefore(
              moment().format("YYYY-MM-DD")
            )
          ) {
            cycleEndDates[0].cycleData.cycle_end = moment().format(
              "YYYY-MM-DD"
            );

            APIManager.updateCycle(
              userData.uid,
              cycleEndDates[0].cycleId,
              cycleEndDates[0].cycleData
            );
            setCurrentCycle(cycleEndDates[0]);
            //     // setCycles(data);
          }
        }
      });
    }
  };

  const getPeriod = bool => {
    if (currentCycle) {
      setIsOnPeriod(
        moment().diff(
          moment(currentCycle.cycleData.period_start, "YYYY-MM-DD"),
          "days"
        ) +
          1 <
          moment(currentCycle.cycleData.period_end, "YYYY-MM-DD").diff(
            moment(currentCycle.cycleData.period_start, "YYYY-MM-DD"),
            "days"
          ) +
            1
      );
    }
  };

  const clickedPeriodLog = () => {
    setPeriodButton(!periodButton);
  };

  firebase
    .database()
    .ref("users")
    .on("child_changed", snapshot => {
      refreshUser();
    });

  useEffect(() => {
    if (userData) {
      let newObj = [];
      firebase
        .database()
        .ref("cycles")
        .child(userData.uid)
        .on("value", snapshot => {
          newObj = [];

          let items = snapshot.val();

          for (let cycle in items) {
            newObj.push({ cycleData: items[cycle], cycleId: cycle });
          }
          if (newObj.length > 0) {
            if (cycles == null || cycles == undefined) {
              setCycles(newObj);
            } else {
              let isSame = true;
              cycles.map((cycle, i) => {
                for (let prop in cycle.cycleData) {
                  isSame = cycle.cycleData[prop] == newObj[i].cycleData[prop];
                }
              });
              if (!isSame) {
                setCycles(newObj);
              }
            }
          }
        });
    }
  });

  const getMissingInfo = () => {
    if (userInfo) {
      const missingInfoArray = [];
      !userInfo.username && missingInfoArray.push("username");
      !userInfo.first_name && missingInfoArray.push("first_name");
      !userInfo.last_name && missingInfoArray.push("last_name");
      !userInfo.is_active && missingInfoArray.push("is_active");
      setMissingUserInfo(missingInfoArray);
    }
  };

  const getMissingData = () => {
    if (userData) {
      setMissingUserData(!userData.photoURL ? "photoURL" : null);
    }
  };

  useEffect(() => {
    getCycles();
  }, [cycles]);

  useEffect(() => {
    getCycles();
  }, [userData]);

  useEffect(() => {
    refreshUser();
  }, [userData]);

  useEffect(() => {
    getPeriod();
  }, [currentCycle]);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      setUserData(user);
    } else {
      setUserData(false);
      setUserInfo(false);
    }
  });

  const logout = () => {
    firebase.auth().signOut();
    history.push("/");
  };

  return (
    <>
      {userInfo && (
        <PT_MENU
          title={"Periodt"}
          page={"home"}
          path={""}
          links={["Home", "Add Log", `My Calendar`, `My Logs`, "Settings"]}
          type={"navbar"}
          element={
            <PT_BUTTON
              handleClick={logout}
              basic={true}
              content={"Log Out"}
              icon={"sign out alternate"}
              iconPosition="right"
            />
          }
        />
      )}
      <Switch>
        <Route
          exact
          path="/"
          render={props =>
            userData === null ? (
              <div>Loading...</div>
            ) : !userData ? (
              <Auth props={props} />
            ) : (
              <Home
                {...props}
                currentCycle={currentCycle}
                isOnPeriod={isOnPeriod}
                getMissingInfo={getMissingInfo}
                getMissingData={getMissingData}
                refreshUser={refreshUser}
                userData={userData}
                userInfo={userInfo}
                logout={logout}
                missingUserInfo={missingUserInfo}
                missingUserData={missingUserData}
              />
            )
          }
        />
        {!userData && userData !== null && <Redirect to="/" />}
        {userData && (
          <>
            <Route
              exact
              path="/add-log"
              render={props => (
                <AddLog
                  cycles={cycles}
                  clickedPeriodLog={clickedPeriodLog}
                  periodButton={{ periodButton }}
                  isOnPeriod={isOnPeriod}
                  {...props}
                  userData={userData}
                  userInfo={userInfo}
                  currentCycle={currentCycle}
                />
              )}
            />
            <Route
              exact
              path="/my-logs"
              render={props => (
                <MyLogs
                  userInfo={userInfo}
                  userData={userData}
                  getLogs={getLogs}
                />
              )}
            />
            <Route
              exact
              path="/my-calendar"
              render={props =>
                userInfo && userInfo.averageCycleDays < 0 ? (
                  <div>You'll need to add a period to access this fature</div>
                ) : (
                  <NewCalendar userData={userData} userInfo={userInfo} />
                )
              }
            />
            <Route
              exact
              path="/logout"
              render={props => {
                logout();
              }}
            />
          </>
        )}
      </Switch>
      <Switch>
        <Route
          exact
          path="/dl"
          component={props => <Redirect to="/dl/home" />}
        />
      </Switch>
    </>
  );
};

export default ApplicationViews;
