import React, { useEffect, useState } from "react";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_MODAL from "../components/modals/PT_MODAL";
import PT_INPUT from "../components/inputs/PT_INPUT";
import APIManager from "../api-manager/APIManager";
import * as firebase from "firebase";
import * as moment from "moment";

const AddLog = ({ userData, userInfo, history }) => {
  const [moods, setMoods] = useState([]);
  const [flows, setFlows] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [noteLog, setNoteLog] = useState(null);
  const [logDate, setLogDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [logIds, setLogIds] = useState({});
  const [openDraftModal, setOpenDraftModal] = useState(false);

  firebase
    .database()
    .ref("mood_types")
    .on("child_changed", snapshot => {
      getMoods();
    });

  firebase
    .database()
    .ref("flow_types")
    .on("child_changed", snapshot => {
      getFlows();
    });

  const getMoods = () => {
    APIManager.getResource("mood_types").then(data => {
      const newArray = [];

      for (let moodId in data) {
        newArray.push({ name: data[moodId].name, id: moodId });
      }
      setMoods(newArray);
    });
  };

  const getFlows = () => {
    APIManager.getResource("flow_types").then(data => {
      const newArray = [];
      for (let moodId in data) {
        newArray.push({ name: data[moodId].name, id: moodId });
      }
      setFlows(newArray);
    });
  };

  const getDrafts = () => {
    APIManager.getDrafts(userData.uid, "mood_logs")
      .then(data => {
        const newObj = { ...drafts };
        if (Object.keys(data).length > 0) {
          newObj.mood_logs = data;
        }
        return newObj;
      })
      .then(newObj => {
        APIManager.getDrafts(userData.uid, "note_logs")
          .then(data => {
            if (Object.keys(data).length) {
              newObj.note_logs = data;
            }
            return newObj;
          })
          .then(newObj => {
            APIManager.getDrafts(userData.uid, "flow_logs")
              .then(data => {
                if (Object.keys(data).length) {
                  newObj.flow_logs = data;
                }
                return newObj;
              })
              .then(newObj => {
                setOpenDraftModal(true);
                setDrafts(newObj);
              });
          });
      });
  };

  const updateMoodLog = () => {};

  const updateFlowLog = () => {};

  const handleDraftModal = e => {
    if (e.target.name == "cancel") {
      for (let type in drafts) {
        APIManager.deleteLog(type, userData.uid, Object.keys(drafts[type])[0]);
      }
      setOpenDraftModal(false);
      setLogIds({});
    } else if (e.target.name === "submit") {
      const draftIds = {};
      for (let type in drafts) {
        if (type === "mood_logs") {
          setSelectedMood(
            drafts[type][Object.keys(drafts[type])[0]].mood_typeId
          );

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
      setOpenDraftModal(false);
      setLogIds(draftIds);
    }
  };

  const makeKey = ref => {
    return firebase
      .database()
      .ref()
      .child("child")
      .push().key;
  };
  const handleChange = e => {
    let ref;
    let obj;

    if (e.target.name === "flow-type") {
      if (logIds.flow_logs) {
        ref = `flow_logs/${userData.uid}/${logIds.flow_logs}`;
        obj = { flow_typeId: e.target.value };
      } else {
        const key = makeKey();

        ref = `flow_logs/${userData.uid}/${key}`;

        obj = {
          flow_typeId: e.target.value,
          date: moment().format("YYYY-MM-DD"),
          isDraft: true
        };

        const newObj = { ...logIds };
        newObj.flow_logs = key;
        setLogIds(newObj);
      }

      setSelectedFlow(e.target.value);
    } else if (e.target.name === "mood-type") {
      if (logIds.mood_logs) {
        ref = `mood_logs/${userData.uid}/${logIds.mood_logs}`;
        obj = { mood_typeId: e.target.value };
      } else {
        const key = makeKey();

        ref = `mood_logs/${userData.uid}/${key}`;

        obj = {
          mood_typeId: e.target.value,
          date: moment().format("YYYY-MM-DD"),
          isDraft: true
        };

        const newObj = { ...logIds };
        newObj.mood_logs = key;
        setLogIds(newObj);
      }
      setSelectedMood(e.target.value);
    } else if (e.target.name === "logDate") {
      setLogDate(e.target.value);
    } else if (e.target.id == "note-area") {
      if (logIds.note_logs) {
        ref = `note_logs/${userData.uid}/${logIds.note_logs}`;
        obj = { content: e.target.value };
      } else {
        const key = makeKey();

        ref = `note_logs/${userData.uid}/${key}`;

        obj = {
          content: e.target.value,
          date: moment().format("YYYY-MM-DD"),
          isDraft: true
        };

        const newObj = { ...logIds };
        newObj.note_logs = key;
        setLogIds(newObj);
      }
      setNoteLog(e.target.value);
    } else if (e.target.name == "add-log") {
      for (let id in logIds) {
        APIManager.updateLog(`${id}/${userData.uid}/${logIds[id]}`, {
          isDraft: false,
          date: logDate
        });
      }

      history.push("/");
    } else if (e.target.name == "cancel-log") {
      for (let id in logIds) {
        APIManager.deleteLog(id, userData.uid, logIds[id]);
      }
      history.push("/");
    }

    if (
      e.target.name !== "add-log" &&
      e.target.name !== "cancel-log" &&
      e.target.name !== "logDate"
    ) {
      APIManager.updateLog(ref, obj);
     
    }
  };

  useEffect(() => {
    getMoods();
    getFlows();
    getDrafts();
  }, []);

  return (
    <>
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
              )
            }}
            isOpen={openDraftModal}
            actionItems={["edit", "delete"]}
            handleAction={handleDraftModal}
          />
        )}
        <div className="log-item">
          <label htmlFor="logDate">Log Date</label>
          <input
            name="logDate"
            type="date"
            onChange={handleChange}
            value={logDate}
            label="date for log"
            max={moment().format("YYYY-MM-DD")}
          />
        </div>
        <div className="log-item">
          {moods.map(item => (
            <PT_BUTTON
              key={item.id}
              content={item.name}
              value={item.id}
              type="circular"
              active={item.id == selectedMood}
              handleClick={handleChange}
              name="mood-type"
            />
          ))}
        </div>
        <div className="log-item">
          {flows.map(item => (
            <PT_BUTTON
              key={item.id}
              content={item.name}
              value={item.id}
              name="flow-type"
              type="circular"
              active={item.id == selectedFlow}
              handleClick={handleChange}
            />
          ))}
        </div>
        <div className="log-item">
          <PT_INPUT
            type="textarea"
            inputId="note-area"
            handleChange={handleChange}
            valueFromState={noteLog}
          />
        </div>
        <div className="log-item">
          <PT_BUTTON
            key="cancel"
            content="Cancel Log"
            value="cancel-log"
            name="cancel-log"
            type="circular"
            handleClick={handleChange}
          />

          <PT_BUTTON
            key="submit"
            content="Add Log"
            value="add-log"
            name="add-log"
            type="circular"
            disabled={
              (selectedMood == null || selectedMood == "") &
              (selectedFlow == null || selectedFlow == "") &
              (noteLog == null || noteLog == "")
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
