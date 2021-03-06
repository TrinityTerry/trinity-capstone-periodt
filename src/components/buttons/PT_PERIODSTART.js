import React, { useState } from "react";
import PT_BUTTON from "./PT_BUTTON";
import PT_MODAL from "../modals/PT_MODAL";
import PT_ICON from "../icons/PT_ICON";
import * as firebase from "firebase";
import * as moment from "moment";
import APIManager from "../../modules/APIManager";
import PT_LOADER from "../loader/PT_LOADER";
import { Popup, Button } from "semantic-ui-react";

const PT_PERIODSTART = ({
  setSnackbarObj,
  isOnPeriod,
  userData,
  currentCycle,
  userInfo,
  size = "huge",
  popupPosition = "top center",
  buttonClass,
}) => {
  const [openEndPeriodModal, setOpenEndPeriodModal] = useState(false);
  const [endPeriodContent, setEndPeriodContent] = useState({
    header: "",
    main: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [currentId, setCurrentId] = useState(null);
  const [popup, setPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");

  const updateCycle = (oneday = false) => {
    const key = makeKey();
    const ref = `cycles/${userData.uid}/${currentCycle.cycleId}`;
    const newObj = { ...currentCycle.cycleData };
    oneday
      ? (newObj.period_end = moment().format("YYYY-MM-DD"))
      : (newObj.period_end = moment().subtract(1, "days").format("YYYY-MM-DD"));

    APIManager.updateLog(ref, newObj);

    setSnackbarObj((prevState) => {
      const newObj = { ...prevState };
      newObj.isOpen = true;
      newObj.content = "Period Ended";
      return newObj;
    });
  };

  const getId = () => {
    return currentId;
  };
  const makeKey = (ref) => {
    return firebase.database().ref().child("child").push().key;
  };
  const openPopup = () => {
    setPopup(true);
    setTimeout(() => {
      setPopup(false);
    }, 4000);
  };

  const handleClick = (e) => {
    setIsLoading(true);

    setCurrentId(e.target.value);
    if (isOnPeriod) {
      const start = moment().format("YYYY-MM-DD");
      APIManager.checkCycleDay(
        "cycles",
        userData.uid,
        "period_start",
        start
      ).then((data) => {
        if (Object.keys(data).length > 0) {
          setPopupContent(
            <div>
              Did you have a 1 day period?
              <button onClick={() => updateCycle(true)}>Yes</button>
              <button>No</button>
            </div>
          );
          openPopup();
        } else {
          updateCycle();
        }
        setIsLoading(false);
      });
    } else {
      const key = makeKey();
      const ref = `cycles/${userData.uid}/${key}`;
      const start = moment().format("YYYY-MM-DD");
      let obj;
      APIManager.checkCycleDay(
        "cycles",
        userData.uid,
        "period_start",
        start
      ).then((data) => {
        if (Object.keys(data).length > 0) {
          setPopupContent("There's already a period starting on this day!");
          openPopup();
        } else {
          if (moment().isBefore(currentCycle.cycleData.cycle_end, "days")) {
            APIManager.updateCycle(userData.uid, currentCycle.cycleId, {
              cycle_end: moment().subtract(1, "days").format("YYYY-MM-DD"),
            });
          }
          if (userInfo.averagePeriodDays > 0) {
            obj = {
              period_start: moment().format("YYYY-MM-DD"),
              period_end: moment()
                .add(userInfo.averagePeriodDays - 1, "days")
                .format("YYYY-MM-DD"),
              cycle_end: moment()
                .add(userInfo.averageCycleDays - 1, "days")
                .format("YYYY-MM-DD"),
            };
          } else {
            obj = {
              period_start: moment().format("YYYY-MM-DD"),
              period_end: moment().add(5, "days").format("YYYY-MM-DD"),
              cycle_end: moment().add(28, "days").format("YYYY-MM-DD"),
            };

            APIManager.updateUser(
              { averagePeriodDays: 5, averageCycleDays: 28 },
              userData.uid
            );
          }
          APIManager.updateLog(ref, obj);

          setSnackbarObj((prevState) => {
            const newObj = { ...prevState };
            newObj.isOpen = true;
            newObj.content = "Cycle Created";
            return newObj;
          });
        }
        setIsLoading(false);
      });
    }
  };

  const handleMouse = (e) => {
    if (e.type == "mouseenter") {
      const start = moment().format("YYYY-MM-DD");
      // setIsLoading(true);
      if (!isOnPeriod) {
        APIManager.checkCycleDay(
          "cycles",
          userData.uid,
          "period_start",
          start
        ).then((data) => {
          if (Object.keys(data).length > 0) {
            setPopupContent("There's already a period starting on this day!");
            openPopup();
          }
          setIsLoading(false);
        });
      } else {
        APIManager.checkCycleDay(
          "cycles",
          userData.uid,
          "period_start",
          start
        ).then((data) => {
          // userInfo.averagePeriodDays
          if (Object.keys(data).length > 0) {
            setPopupContent(
              <div>
                Did you have a 1 day period?
                <button onClick={updateCycle}>Yes</button>
                <button>No</button>
              </div>
            );
            openPopup();
          } else {
            updateCycle();
          }
          setIsLoading(false);
        });
      }
    } else {
      setTimeout(() => {
        setPopup(false);
      }, 4000);
    }
  };

  return (
    <>
      {currentCycle !== undefined && (
        <PT_MODAL
          content={{
            mainText: endPeriodContent.header,
            modalHeader: (
              <PT_ICON
                name="delete"
                onClick={() => setOpenEndPeriodModal(false)}
              />
            ),
          }}
          isOpen={openEndPeriodModal}
          actionItems={["delete", "save"]}
          currentCycle={currentCycle}
          size="tiny"
        />
      )}
      <Popup
        open={popup}
        content={popupContent}
        position={popupPosition}
        pinned
        trigger={
          <PT_BUTTON
            icon={"plus"}
            handleClick={(e) => {
              handleClick(e);
            }}
            // handleMouseEnter={handleMouse}
            // handleMouseLeave={handleMouse}
            content={isOnPeriod ? "Period Ended" : "Period Started"}
            circular={true}
            size="huge"
            value={currentCycle && currentCycle.cycleId}
            buttonClass={buttonClass}
            size={size}
          />
        }
      />
    </>
  );
};

export default PT_PERIODSTART;
