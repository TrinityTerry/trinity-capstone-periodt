import React, { useEffect, useState, useCallback } from "react";
import APIManager from "../modules/APIManager";
import PT_MODAL from "../components/modals/PT_MODAL";
import UpdateUserForm from "../components/forms/updateUser";
import { Link } from "react-router-dom";
import PT_CYCLE from "../components/cycle/PT_CYCLE";
import * as moment from "moment";
import PT_PERIODSTART from "../components/buttons/PT_PERIODSTART";
import * as firebase from "firebase";

import "firebase/database";
import PT_BUTTON from "../components/buttons/PT_BUTTON";

const Home = ({
  userData,
  userInfo,
  refreshUser,
  logout,
  getMissingInfo,
  getMissingData,
  missingUserInfo,
  missingUserData,
  getPeriod,
  isOnPeriod
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [openCycleModal, setOpenCycleModal] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(null);
  const [cycleInfo, setCycleInfo] = useState({
    nextPeriod: "",
    periodEnd: "",
    periodStart: "",
    predictedCycleEnd: ""
  });
  const [allCycles, setAllCycles] = useState();

  useEffect(() => {
    if (userInfo !== null) {
      if (userInfo === undefined) {
        APIManager.createNewUser(userData.uid).then(() => {
          refreshUser();
          getMissingInfo();
          getMissingData();
        });
      } else {
        getMissingInfo();
        getMissingData();
      }
    }
  }, [userInfo]);

  useEffect(() => {
    let openIt = false;

    if (missingUserInfo.length > 0) {
      openIt = true;
    }

    if (missingUserData !== null) {
      openIt = true;
    }

    setOpenModal(openIt);
  }, [missingUserInfo, missingUserData]);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    forceUpdate();
  }, [isOnPeriod]);

  useEffect(() => {
    firebase
      .database()
      .ref("cycles")
      .child(userData.uid)
      .on("value", snapshot => {
        const newObj = [];

        let items = snapshot.val();
        const isSame = [];
        if (items && allCycles) {
          for (let cycle in items) {
            if (allCycles[cycle]) {
              isSame.push(items[cycle].cycle_end == allCycles[cycle].cycle_end);

              isSame.push(
                items[cycle].period_end == allCycles[cycle].period_end
              );
              isSame.push(
                items[cycle].period_start == allCycles[cycle].period_start
              );
            } else {
            }

            // newObj.push({ cycleData: items[cycle], cycleId: cycle });
          }

          if (isSame.includes(false)) {
            // refreshCycle();
          }
        }
      });
  });

  const passInfo = (info, data) => {
    setOpenModal(false);
    let obj = {};
    if (info.username !== "") {
      obj.username = info.username;
    }
    if (info.first_name !== "") {
      obj.first_name = info.first_name;
    }
    if (info.last_name !== "") {
      obj.last_name = info.last_name;
    }
    let url = false;
    if (data.photoURL !== "") {
      url = data.photoURL;
      obj.photoURL = data.photoURL;
    }

    APIManager.updateUser(obj, userData.uid).then(() => {
      if (url) {
        userData
          .updateProfile({
            photoURL: url
          })
          .then(() => {
            getMissingData();
            refreshUser();
          });
      }
    });
  };

  useEffect(() => {
    refreshCycle();
  }, [missingUserInfo, missingUserData, isOnPeriod]);

  const refreshCycle = () => {

    const infoObj = {};
    if (missingUserInfo.length <= 0 && missingUserData === null) {
      APIManager.getUserCycles(userData.uid).then(data => {
        setAllCycles(data);
        if (!data || Object.keys(data).length === 0) {
          const emptyObj = {
            cycleData: {
              cycle_end: moment().format("YYYY-MM-DD"),
              period_end: moment().format("YYYY-MM-DD"),
              period_start: moment().format("YYYY-MM-DD")
            }
          };
          setCycleInfo({
            nextPeriod: moment(),
            periodEnd: moment(),
            periodStart: moment(),
            predictedCycleEnd: moment().add(1, "days")
          });

          setCurrentCycle(emptyObj);
        } else {
          let cycleEndDates = [];
          let thisId;
          for (let cycle in data) {
            thisId = cycle;
            cycleEndDates.push({ cycleData: data[cycle], cycleId: cycle });
          }

          cycleEndDates.sort(
            (a, b) =>
              moment(b.cycleData.cycle_end, "YYYY-MM-DD").format("YYYYMMDD") -
              moment(a.cycleData.cycle_end, "YYYY-MM-DD").format("YYYYMMDD")
          );

          setCycleInfo({
            periodStart: moment(
              cycleEndDates[0].cycleData.period_start,
              "YYYY-MM-DD"
            ),
            periodEnd: moment(
              cycleEndDates[0].cycleData.period_end,
              "YYYY-MM-DD"
            ),

            predictedCycleEnd: moment(
              cycleEndDates[0].cycleData.cycle_end,
              "YYYY-MM-DD"
            ),

            middleMonths: moment(
              cycleEndDates[0].cycleData.cycle_end,
              "YYYY-MM-DD"
            ).diff(
              moment(cycleEndDates[0].cycleData.period_start, "YYYY-MM-DD"),
              "months",
              true
            ),
            nextPeriod: moment(
              cycleEndDates[0].cycleData.cycle_end,
              "YYYY-MM-DD"
            ).add(1, "days"),
            currentCycleId: thisId
          });

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
              cycleEndDates[0].cycleId,
              cycleEndDates[0].cycleData
            );
            setCurrentCycle(cycleEndDates[0]);
          }
        }
      });
    }
  };

  const handleCycleModal = (e, { name }) => {
    if (name === "submit") {
      setOpenCycleModal(false);
    }
  };

  return (
    <>
      <PT_MODAL
        content={{
          modalHeader: "Update Account",
          descriptionHeader: "Update account information to continue",
          mainText: (
            <>
              <UpdateUserForm
                passInfo={passInfo}
                missingUserInfo={missingUserInfo}
                missingUserData={missingUserData}
              />
            </>
          )
        }}
        isOpen={openModal}
        actionItems={["cancel"]}
        handleAction={() => {
          logout();
        }}
      />
      {currentCycle !== null && userInfo !== undefined && userInfo !== null && (
        <>
          <PT_MODAL
            content={{
              modalHeader: "Update Cycle",
              descriptionHeader: `Your cycle was supposed to end ${moment(
                currentCycle.cycleData.cycle_end,
                "YYYY-MM-DD"
              ).calendar(null, {
                sameDay: "[today]",
                nextDay: "[tomorrow]",
                nextWeek: "dddd",
                lastDay: "[yesterday]",
                lastWeek: "[last] dddd",
                sameElse: "[on] DD/MM/YYYY"
              })}`,
              mainText: (
                <>
                  <p>
                    If you have had your period since you last checked in with
                    Periodt, you can add it using the calendar.
                  </p>
                </>
              )
            }}
            isOpen={openCycleModal}
            actionItems={["yes", "no"]}
            handleAction={handleCycleModal}
          />
          <div className="home-page">
            <div className="home-page-content">
              <div className="homepage-cycle">
                <PT_CYCLE
                  size={150}
                  username={userInfo.first_name}
                  periodStart={cycleInfo.periodStart}
                  predictedCycleEnd={cycleInfo.predictedCycleEnd}
                  averageCycleLength={userInfo.averageCycleDays}
                  middleMonths={cycleInfo.middleMonths}
                  nextPeriod={cycleInfo.nextPeriod}
                  currentCycleId={cycleInfo.currentCycleId}
                  periodEndDay={
                    cycleInfo.periodEnd.diff(cycleInfo.periodStart, "days") + 1
                  }
                  cycleDays={
                    cycleInfo.predictedCycleEnd.diff(
                      cycleInfo.periodStart,
                      "days"
                    ) + 1
                  }
                  dots={"small"}
                  currentCycleDay={
                    moment().diff(cycleInfo.periodStart, "days") + 1
                  }
                />
              </div>
              <div className="home-page-buttons">
                {currentCycle && (
                  <div className="home-page-button-container">
                    <PT_PERIODSTART
                      userData={userData}
                      isOnPeriod={isOnPeriod}
                      userInfo={userInfo}
                      currentCycle={currentCycle}
                      size="massive"
                      buttonClass="home-page-button"
                    />
                  </div>
                )}

                <Link to="/add-log" className="home-page-button-container">
                  <PT_BUTTON
                    icon={"plus"}
                    content="Add Log"
                    circular={true}
                    size="massive"
                    buttonClass="home-page-button"
                  />
                </Link>

                {userInfo.averageCycleDays > 0 && (
                  <>
                    <Link
                      to="/my-calendar"
                      className="home-page-button-container"
                    >
                      <PT_BUTTON
                        icon={"calendar alternate outline"}
                        content="Past Cycles"
                        circular={true}
                        size="massive"
                        buttonClass="home-page-button"
                      />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  return update;
}
