import React, { useEffect, useState } from "react";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_MODAL from "../components/modals/PT_MODAL";
import PT_INPUT from "../components/inputs/PT_INPUT";
import Grid from "@material-ui/core/Grid";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import APIManager from "../modules/APIManager";
import * as firebase from "firebase";
import * as moment from "moment";
import PT_PROGRESS from "../components/loader/PT_PROGRESS";

/* 

setIsLoading((prevState) => {
          const newObj = { ...prevState };
          newObj.loading = false;
          newObj.progress = 0;
          return newObj;
        });

          
*/
const AddLog = ({
  userData,
  userInfo,
  history,
  isOnPeriod,
  clickedPeriodLog,
  cycles,
  periodButton,
}) => {
  const [moods, setMoods] = useState([]);
  const [flows, setFlows] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [noteLog, setNoteLog] = useState(null);
  const [logDate, setLogDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [logIds, setLogIds] = useState({});
  const [openDraftModal, setOpenDraftModal] = useState(false);
  const [isLoading, setIsLoading] = useState({
    loading: true,
    left: 0,
    progress: 0,
  });

  useEffect(() => {
    let progressTimer;
    if (isLoading.progress == 100) {
      progressTimer = setTimeout(() => {
        setIsLoading((prevState) => {
          const newObj = { ...prevState };
          newObj.loading = false;
          newObj.progress = 0;
          return newObj;
        });
      }, 500);
    }
    return () => {
      clearTimeout(progressTimer);
    };
  }, [isLoading]);

  firebase
    .database()
    .ref("mood_types")
    .on("child_changed", (snapshot) => {
      getMoods();
    });

  firebase
    .database()
    .ref("flow_types")
    .on("child_changed", (snapshot) => {
      getFlows();
    });

  const getMoods = () => {
    APIManager.getResource("mood_types").then((data) => {
      const newArray = [];

      for (let moodId in data) {
        newArray.push({
          name: data[moodId].name,
          id: moodId,
          icon: data[moodId].icon,
        });
      }
      setMoods(newArray);
      setIsLoading((prevState) => {
        const newObj = { ...prevState };
        newObj.progress = newObj.progress + 30;
        return newObj;
      });
    });
  };

  const getFlows = () => {
    APIManager.getResource("flow_types").then((data) => {
      const newArray = [];
      for (let flowId in data) {
        newArray.push({
          name: data[flowId].name,
          id: flowId,
          value: data[flowId].value,
          icon: data[flowId].icon,
        });
      }

      newArray.sort((a, b) => {
        return a.value - b.value;
      });
      setIsLoading((prevState) => {
        const newObj = { ...prevState };
        newObj.progress = newObj.progress + 30;
        return newObj;
      });
      setFlows(newArray);
    });
  };

  const getDrafts = () => {
    APIManager.getDrafts(userData.uid, "mood_logs")
      .then((data) => {
        const newObj = { ...drafts };
        if (Object.keys(data).length > 0) {
          newObj.mood_logs = data;
        }
        setIsLoading((prevState) => {
          const newObj = { ...prevState };
          newObj.progress = newObj.progress + 10;
          return newObj;
        });
        return newObj;
      })
      .then((newObj) => {
        APIManager.getDrafts(userData.uid, "note_logs")
          .then((data) => {
            if (Object.keys(data).length) {
              newObj.note_logs = data;
            }
            setIsLoading((prevState) => {
              const newObj = { ...prevState };
              newObj.progress = newObj.progress + 10;
              return newObj;
            });
            return newObj;
          })
          .then((newObj) => {
            APIManager.getDrafts(userData.uid, "flow_logs")
              .then((data) => {
                if (Object.keys(data).length) {
                  newObj.flow_logs = data;
                }
                setIsLoading((prevState) => {
                  const newObj = { ...prevState };
                  newObj.progress = newObj.progress + 10;
                  return newObj;
                });
                return newObj;
              })
              .then((newObj) => {
                setOpenDraftModal(true);
                setDrafts(newObj);
                setIsLoading((prevState) => {
                  const newObj = { ...prevState };
                  newObj.progress = newObj.progress + 10;
                  return newObj;
                });
              });
          });
      });
  };

  const handleDraftModal = (e) => {
    if (e.target.name === "cancel") {
      for (let type in drafts) {
        APIManager.deleteLog(type, userData.uid, Object.keys(drafts[type])[0]);
      }
      setOpenDraftModal(false);
      setLogIds({});
    } else if (e.target.name === "submit") {
      const draftIds = {};
      let date;
      for (let type in drafts) {
        date = drafts[type][Object.keys(drafts[type])[0]].date;

        if (type === "mood_logs") {
          setSelectedMood(
            drafts[type][Object.keys(drafts[type])[0]].mood_typeId
          );
          console.log(drafts[type][Object.keys(drafts[type])[0]].mood_typeId);

          draftIds.mood_logs = Object.keys(drafts[type])[0];
        } else if (type === "note_logs") {
          setNoteLog(drafts[type][Object.keys(drafts[type])[0]].content);
          draftIds.note_logs = Object.keys(drafts[type])[0];
        } else if (type === "flow_logs") {
          setSelectedFlow(
            drafts[type][Object.keys(drafts[type])[0]].flow_typeId
          );
          draftIds.flow_logs = Object.keys(drafts[type])[0];
        }
      }
      setLogDate(moment(date).format("MM/DD/YYYY"));
      setLogIds(draftIds);
    }
    setOpenDraftModal(false);
  };

  const makeKey = (ref) => {
    return firebase.database().ref().child("child").push().key;
  };

  const handleChange = (e) => {
    let ref;
    let obj;

    if (moment.isMoment(e)) {
      setLogDate(e.format("YYYY-MM-DD"));
    } else if (
      e.currentTarget.value === "" &&
      e.currentTarget.id !== "note-area"
    ) {
      if (logIds[e.target.name.split("-")[0] + "_logs"] !== undefined) {
        APIManager.deleteLog(
          e.target.name.split("-")[0] + "_logs",
          userData.uid,
          logIds[e.target.name.split("-")[0] + "_logs"]
        );

        delete logIds[e.target.name.split("-")[0] + "_logs"];
      }
      if (e.target.name.split("-")[0] == "mood") {
        setSelectedMood("");
      } else if (e.target.name.split("-")[0] == "flow") {
        setSelectedFlow("");
      }
      // setSelectedMood("")
    } else if (e.currentTarget.name === "flow-type") {
      if (logIds.flow_logs) {
        ref = `flow_logs/${userData.uid}/${logIds.flow_logs}`;
        obj = { flow_typeId: e.currentTarget.value };
      } else {
        const key = makeKey();

        ref = `flow_logs/${userData.uid}/${key}`;

        obj = {
          flow_typeId: e.currentTarget.value,
          date: moment().format("YYYY-MM-DD"),
          isDraft: true,
        };

        const newObj = { ...logIds };
        newObj.flow_logs = key;
        setLogIds(newObj);
      }

      setSelectedFlow(e.currentTarget.value);
    } else if (e.currentTarget.name === "mood-type") {
      if (logIds.mood_logs) {
        ref = `mood_logs/${userData.uid}/${logIds.mood_logs}`;
        obj = { mood_typeId: e.currentTarget.value };
      } else {
        const key = makeKey();

        ref = `mood_logs/${userData.uid}/${key}`;

        obj = {
          mood_typeId: e.currentTarget.value,
          date: moment().format("YYYY-MM-DD"),
          isDraft: true,
        };

        const newObj = { ...logIds };
        newObj.mood_logs = key;
        setLogIds(newObj);
      }
      setSelectedMood(e.currentTarget.value);
    } else if (e.target.id === "note-area") {
      if (logIds.note_logs) {
        ref = `note_logs/${userData.uid}/${logIds.note_logs}`;
        obj = { content: e.target.value };
      } else {
        const key = makeKey();

        ref = `note_logs/${userData.uid}/${key}`;

        obj = {
          content: e.target.value,
          date: moment().format("YYYY-MM-DD"),
          isDraft: true,
        };

        const newObj = { ...logIds };
        newObj.note_logs = key;
        setLogIds(newObj);
      }
      setNoteLog(e.target.value);
    } else if (e.target.name === "add-log") {
      for (let id in logIds) {
        APIManager.updateLog(`${id}/${userData.uid}/${logIds[id]}`, {
          isDraft: false,
          date: logDate,
        });
      }

      history.push("/");
    } else if (e.target.name === "cancel-log") {
      for (let id in logIds) {
        APIManager.deleteLog(id, userData.uid, logIds[id]);
      }
      history.push("/");
    }

    if (
      !moment.isMoment(e) &&
      e.target.name !== "add-log" &&
      e.target.name !== "cancel-log" &&
      e.target.name !== "logDate" &&
      e.target.value !== ""
    ) {
      APIManager.updateLog(ref, obj);
    }
  };

  useEffect(() => {
    setIsLoading((prevState) => {
      const newObj = { ...prevState };
      newObj.loading = true;
      newObj.progress = 0;
      return newObj;
    });
    getMoods();
    getFlows();
    getDrafts();
  }, []);

  return (
    <>
      {isLoading.loading && <PT_PROGRESS progress={isLoading.progress} />}
      <div className="log-page">
        {Object.keys(drafts).length > 0 && (
          <PT_MODAL
            content={{
              modalHeader: "You have a saved draft",
              mainText: (
                <>
                  {drafts.mood_logs && "mood "}
                  {drafts.flow_logs && "flow "}
                  {drafts.note_logs && "note "}
                  <hr />
                  <p>Would you like to continue or delete this draft?</p>
                </>
              ),
            }}
            isOpen={openDraftModal}
            actionItems={["edit", "delete"]}
            handleAction={handleDraftModal}
          />
        )}
        <div className="log-page-title">
          <h1>Add a Log</h1>
        </div>
        <div className="log-item">
          <h3 className="log-item-title">How are you feeling?</h3>
          <div className="log-item-buttons">
            <PT_BUTTON
              key="clear-mood"
              content="clear"
              value=""
              circular={true}
              active={"" === selectedMood}
              handleClick={handleChange}
              name="mood-type"
              basic={true}
            />

            {moods.map((item) => {
              return (
                <PT_BUTTON
                  key={item.id}
                  content={<img width={"40px"} src={item.icon} />}
                  compact={true}
                  value={item.id}
                  circular={true}
                  active={item.id === selectedMood}
                  handleClick={handleChange}
                  name="mood-type"
                  // size="small"
                  basic={true}
                />
              );
            })}
          </div>
        </div>
        <hr />
        <div className="log-item">
          <h3 className="log-item-title">How is you're flow?</h3>
          <div className="log-item-buttons">
            <PT_BUTTON
              key="clear-flow"
              content="no flow"
              value=""
              name="flow-type"
              circular={true}
              active={"" === selectedFlow}
              handleClick={handleChange}
              basic={true}
            />
            {flows.map((item) => (
              <PT_BUTTON
                basic={true}
                key={item.id}
                content={<img width={"40px"} src={item.icon} />}
                compact={true}
                value={item.id}
                name="flow-type"
                circular={true}
                active={item.id === selectedFlow}
                handleClick={handleChange}
              />
            ))}
          </div>
        </div>
        <hr />
        <div className="log-item">
          <h3 className="log-item-title">Anything else you want to log?</h3>
          <PT_INPUT
            type="textarea"
            inputId="note-area"
            handleChange={handleChange}
            valueFromState={noteLog}
            className="log-item-input"
          />
        </div>
        <hr />
        <div className="log-item">
          <div className="log-item-date">
            <label htmlFor="logDate" className="log-item-title">
              Log Date
            </label>
            <PT_INPUT
              type="date"
              handleChange={handleChange}
              valueFromState={logDate}
              inputId="date-picker-inline"
            />
          </div>
        </div>
        <div className="log-item-buttons-actions">
          <PT_BUTTON
            key="cancel"
            content="Cancel"
            value="cancel-log"
            name="cancel-log"
            type="circular"
            handleClick={handleChange}
          />

          <PT_BUTTON
            key="submit"
            content="Save"
            value="add-log"
            name="add-log"
            type="circular"
            disabled={
              (selectedMood === null || selectedMood === "") &
              (selectedFlow === null || selectedFlow === "") &
              (noteLog === null || noteLog === "")
                ? true
                : false
            }
            handleClick={handleChange}
          />
        </div>
      </div>
    </>
  );
};

export default AddLog;
