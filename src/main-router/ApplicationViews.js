import React, { useState, useEffect } from "react";
import { Route, useHistory, Switch, Redirect } from "react-router-dom";
import * as firebase from "firebase";
import Home from "../views/Home";
import Auth from "../views/Login";
import MyLogs from "../views/MyLogs";
import NewCalendar from "../views/NewCalendar";
import MyTrends from "../views/MyTrends";
import Settings from "../views/Settings";
import AddLog from "../views/AddLog";
import PT_TOPMENU from "../components/menus/PT_TOPMENU";
import PT_BOTTOMNAV from "../components/menus/PT_BOTTOMNAV";
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
  const [confirmedUID, setConfirmedUID] = useState([
    "7uCbWiMWcYbWlAoZhzciZKwS88C2",
    "JnyhNrHiDNgkgJwBYCKOW6j3jnz1"
  ]);
  const refreshUser = () => {
    var user = firebase.auth().currentUser;
    if (user) {
      if (user.emailVerified || confirmedUID.includes(user.uid)) {
        APIManager.getUserInfo(user.uid)
          .then(data => data[user.uid])
          .then(setUserInfo);
        // .then(() => getAverages());
      } else {
        if (
          firebase.auth().currentUser.metadata.creationTime ===
          firebase.auth().currentUser.metadata.lastSignInTime
        ) {
          sendverificationEmail(user);
        }
      }
    } else {
    }
  };

  useEffect(() => {
    if (userData) {
      firebase
        .database()
        .ref(`users`)
        .child(userData.uid)
        .on("child_changed", snapshot => {
          refreshUser();
        });
    }
  });

  const sendverificationEmail = user => {
    const actionCodeSettings = {
      url: "https://periodt.netlify.com"
    };

    firebase
      .auth()
      .currentUser.sendEmailVerification(actionCodeSettings)
      .then(function() {
        alert("Verification Email Sent");
        firebase.auth().signOut();
      })
      .catch(function(error) {
        alert(error);
      });
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
        if (data === null || Object.keys(data).length === 0) {
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
          cycleEndDates.sort(
            (a, b) =>
              moment(b.cycleData.cycle_end, "YYYY-MM-DD").format("YYYYMMDD") -
              moment(a.cycleData.cycle_end, "YYYY-MM-DD").format("YYYYMMDD")
          );
          setCurrentCycle(cycleEndDates[0]);

          if (userInfo) {
            // if (
            //   moment(cycleEndDates[0].cycleData.cycle_end, "YYYY-MM-DD").diff(
            //     moment(cycleEndDates[0].cycleData.period_start, "YYYY-MM-DD"),
            //     "days"
            //   ) !==
            //   userInfo.averageCycleDays - 1
            // ) {
            //   cycleEndDates[0].cycleData.cycle_end = moment(
            //     cycleEndDates[0].cycleData.period_start
            //   )
            //     .add(userInfo.averageCycleDays - 1, "days")
            //     .format("YYYY-MM-DD");
            //   APIManager.updateCycle(
            //     userData.uid,
            //     cycleEndDates[0].cycleId,
            //     cycleEndDates[0].cycleData
            //   );
            //   setCurrentCycle(cycleEndDates[0]);
            // }
          }

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
    .on("child_changed", snapshot => {});

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
            if (cycles === null || cycles === undefined) {
              setCycles(newObj);
            } else {
              let isSame = true;
              cycles.forEach((cycle, i) => {
                if (newObj[i] !== undefined) {
                  for (let prop in cycle.cycleData) {
                    isSame =
                      cycle.cycleData[prop] === newObj[i].cycleData[prop];
                  }
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
      !userInfo.nickname && missingInfoArray.push("nickname");
      !userInfo.first_name && missingInfoArray.push("first_name");
      !userInfo.last_name && missingInfoArray.push("last_name");
      !userInfo.is_active && missingInfoArray.push("is_active");
      setMissingUserInfo(missingInfoArray);

      !userInfo.settings &&
        APIManager.updateUser(
          {
            settings: {
              notifications_enabled: false,
              useDefaultCycle: true,
              ignoreMin: 10,
              ignoreMax: 60,
              defaultCycle: 28,
              defaultPeriod: 5
            }
          },
          userData.uid
        );
    }
  };

  const getMissingData = () => {
    if (userData) {
      setMissingUserData(!userData.photoURL ? "photoURL" : null);

      userData.photoURL &&
        APIManager.updateUser({ photoURL: userData.photoURL }, userData.uid);
    }
  };

  const getAverages = () => {
    const periodDays = [];
    const cycleDays = [];

    if (cycles && userInfo) {
      if (userInfo.settings.useDefaultCycle) {
        periodDays.push(userInfo.settings.defaultPeriod);

        cycleDays.push(userInfo.settings.defaultCycle);
      } else {
        cycles.forEach(element => {
          const period =
            moment(element.cycleData.period_end, "YYYY-MM-DD").diff(
              moment(element.cycleData.period_start, "YYYY-MM-DD"),
              "days"
            ) + 1;

          const cycle =
            moment(element.cycleData.cycle_end, "YYYY-MM-DD").diff(
              moment(element.cycleData.period_start, "YYYY-MM-DD"),
              "days"
            ) + 1;

          if (
            cycle > userInfo.settings.ignoreMin &&
            cycle < userInfo.settings.ignoreMax
          ) {
            cycleDays.push(cycle);
          }
          periodDays.push(period);
        });
      }

      const newObj = { ...userInfo };
      if (cycleDays.length > 0) {
        newObj.averageCycleDays = Math.round(
          cycleDays.reduce((a, b) => a + b) / cycleDays.length
        );
      } else {
        newObj.averageCycleDays = userInfo.settings.defaultCycle;
      }

      if (periodDays.length > 0) {
        newObj.averagePeriodDays = Math.round(
          periodDays.reduce((a, b) => a + b) / periodDays.length
        );
      } else {
        newObj.averagePeriodDays = userInfo.settings.defaultPeriod;
      }

      APIManager.updateUser(newObj, userData.uid);
    } else if (userData && cycles == null) {
      APIManager.updateUser(
        { averageCycleDays: 28, averagePeriodDays: 5 },
        userData.uid
      );
    }
  };

  // useEffect(() => {
  // }, [cycles, userData]);

  useEffect(() => {
    getCycles();
    getAverages();
  }, [cycles, userInfo, userData]);

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
        <PT_TOPMENU
          title={"Periodt"}
          path={""}
          links={[
            "Home",
            "Add Log",
            `My Calendar`,
            `My Logs`,
            // "Cycle History",
            "Predictions"
          ]}
        />
      )}
      <div className="app-body">
        <Switch>
          <Route
            exact
            path="/"
            render={props =>
              userData !== null &&
              !confirmedUID.includes(userData.uid) &&
              (!userData || !userData.emailVerified) ? (
                <Auth
                  sendverificationEmail={sendverificationEmail}
                  props={props}
                  logout={logout}
                  verified={userData.emailVerified}
                  userData={userData}
                />
              ) : (
                <Home
                  {...props}
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

          <Route exact path="/home" render={props => <Redirect to="/" />} />
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
                  />
                )}
              />
              <Route
                exact
                path="/logs"
                render={props =>
                  userInfo && (
                    <MyLogs
                      userInfo={userInfo}
                      userData={userData}
                      getLogs={getLogs}
                    />
                  )
                }
              />
              <Route
                exact
                path="/trends/:element"
                render={props =>
                  userInfo && (
                    <MyTrends
                      page={props.match.params.element}
                      userInfo={userInfo}
                      userData={userData}
                      {...props}
                    />
                  )
                }
              />
              <Route
                exact
                path="/trends"
                render={props =>
                  userInfo && <Redirect to="/trends/everything" />
                }
              />

              <Route
                exact
                path="/calendar"
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
                path="/settings"
                render={props => userInfo && <Redirect to="/settings/home" />}
              />

              <Route
                exact
                path="/settings/:category"
                render={props =>
                  userInfo && (
                    <Settings
                      {...props}
                      userData={userData}
                      userInfo={userInfo}
                      page={props.match.params.category}
                    />
                  )
                }
              />

              {/* <Route
                exact
                path="settings/cycle-history"
                render={props =>
                  userInfo && (
                    <MyPeriods userData={userData} userInfo={userInfo} />
                  )
                }
              /> */}

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
      </div>
      <div id="tr-footer"></div>
      {userInfo && (
        <PT_BOTTOMNAV
          title={"Periodt"}
          page={"home"}
          path={""}
          links={["Home", "Add Log", `Calendar`, `Logs`, "Trends"]}
          type={"bottomnav"}
        />
      )}
    </>
  );
};

export default ApplicationViews;
