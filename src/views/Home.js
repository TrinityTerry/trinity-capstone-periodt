import React, { useEffect, useState } from "react";
import APIManager from "../modules/APIManager";
import PT_MODAL from "../components/modals/PT_MODAL";
import UpdateUserForm from "../components/forms/updateUser";
import { Link } from "react-router-dom";
import PT_CYCLE from "../components/cycle/PT_CYCLE";
import * as moment from "moment";
import PT_PERIODSTART from "../components/buttons/PT_PERIODSTART";

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

  useEffect(() => {
    if (userInfo !== null) {
      if (userInfo == undefined) {
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
    if (missingUserInfo.length <= 0 && missingUserData == null) {
      APIManager.getUserCycles(userData.uid).then(data => {
        if (!data || Object.keys(data).length == 0) {
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
            setOpenCycleModal(true);
          }
        }
      });
    }
  }, [missingUserInfo, missingUserData, isOnPeriod]);

  const handleCycleModal = (e, { name }) => {
    if (name == "submit") {
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

          <PT_CYCLE
            getPeriod={getPeriod}
            username={userInfo.first_name}
            periodStart={moment(
              currentCycle.cycleData.period_start,
              "YYYY-MM-DD"
            )}
            periodEnd={moment(currentCycle.cycleData.period_end, "YYYY-MM-DD")}
            predictedCycleEnd={moment(
              currentCycle.cycleData.cycle_end,
              "YYYY-MM-DD"
            )}
            averageCycleLength={userInfo.averageCycleDays}
            middleMonths={moment(
              currentCycle.cycleData.cycle_end,
              "YYYY-MM-DD"
            ).diff(
              moment(currentCycle.cycleData.period_start, "YYYY-MM-DD"),
              "months",
              true
            )}
            nextPeriod={moment(
              currentCycle.cycleData.cycle_end,
              "YYYY-MM-DD"
            ).add(1, "days")}
          />
          <div className="home-page-buttons">
            {currentCycle && (
              <PT_PERIODSTART
                userData={userData}
                isOnPeriod={isOnPeriod}
                userInfo={userInfo}
                currentCycle={currentCycle}
              />
            )}

            <Link to="/add-log">
              <PT_BUTTON
                icon={"plus"}
                content="Add Log"
                circular={true}
                size="huge"
                buttonClass="home-page-button"
              />
            </Link>

            {userInfo.averageCycleDays > 0 && (
              <>
                <Link to="/my-calendar">
                  <PT_BUTTON
                    icon={"calendar alternate outline"}
                    content="Past Cycles"
                    circular={true}
                    size="huge"
                    buttonClass="home-page-button"
                  />
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
// "Fri, 13 Mar 2020 21:36:37 GMT"
