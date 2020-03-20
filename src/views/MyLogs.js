import React, { useEffect, useState } from "react";
import PT_CARD from "../components/cards/PT_CARD";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import { Card } from "semantic-ui-react";
import APIManager from "../modules/APIManager";

const MyLogs = ({ userData, userInfo }) => {
  const [logs, setLogs] = useState({
    mood_logs: [],
    note_logs: [],
    flow_logs: []
  });

  const [editingLog, setEditingLogs] = useState({
    mood_logs: [],
    note_logs: [],
    flow_logs: []
  });

  const [types, setTypes] = useState({
    mood_types: {},
    flow_types: {}
  });

  const getNames = () => {
    const newObj = { ...types };
    APIManager.getResource(`mood_types`)
      .then(data => {
        for (let props in data) {
          newObj.mood_types[props] = data[props].name;
        }
      })
      .then(() => {
        APIManager.getResource(`flow_types`).then(data => {
          for (let props in data) {
            newObj.flow_types[props] = data[props].name;
          }
          setTypes(newObj);
        });
      });
  };

  const getLogs = () => {
    const newObj = { ...logs };
    APIManager.getResource(`mood_logs/${userData.uid}`)
      .then(data => {
        const newArray = [];
        for (let props in data) {
          newArray.push({ data: data[props], id: props, isEditing: false });
        }
        newObj.mood_logs = newArray;
      })
      .then(() => {
        APIManager.getResource(`flow_logs/${userData.uid}`)
          .then(data => {
            const newArray = [];
            for (let props in data) {
              newArray.push({ data: data[props], id: props, isEditing: false });
            }
            newObj.flow_logs = newArray;
          })
          .then(() => {
            APIManager.getResource(`note_logs/${userData.uid}`).then(data => {
              const newArray = [];
              for (let props in data) {
                newArray.push({
                  data: data[props],
                  id: props,
                  isEditing: false
                });
              }
              newObj.note_logs = newArray;
              setLogs(newObj);
              setEditingLogs(newObj);
            });
          });
      });
  };

  useEffect(() => {
    getNames();
    getLogs();
  }, []);

  const handleClick = e => {
    const split = e.currentTarget.id.split("--");
    if (split[0] == "edit") {
      const newObj = { ...logs };

      newObj[`${split[1]}_logs`][
        logs[`${split[1]}_logs`].findIndex(item => item.id == split[2])
      ].isEditing = true;

      setLogs(newObj);
    }

    if (split[0] == "submit") {
      console.log("submitted");
    }
  };

  const handleTypeChange = e => {
    const split = e.target.value.split("--");
    const newObj = { ...logs };
    const editingIndex = split[3];
    console.log(newObj[`${split[0]}_logs`][editingIndex].id);
    if (newObj[`${split[0]}_logs`][editingIndex]) {
      console.log(editingLog.flow_logs);
      newObj[`${split[0]}_logs`][editingIndex].id = split[2];
    }
    setEditingLogs(newObj);

    // const split = e.currentTarget.id.split("--");
    // if (split[0] == "edit") {
    //   const newObj = { ...logs };

    //   newObj[`${split[1]}_logs`][
    //     logs[`${split[1]}_logs`].findIndex(item => item.id == split[2])
    //   ].isEditing = true;

    //   setLogs(newObj);
    // }
  };

  return (
    <>
      <h1>Flow Logs</h1>

      <Card.Group stackable itemsPerRow={3}>
        {logs.flow_logs.map((item, i) => {
          return item.isEditing ? (
            <PT_CARD
              id={editingLog.flow_logs[i].id}
              key={editingLog.flow_logs[i].id}
              description={
                <>
                  <PT_BUTTON
                    handleClick={handleClick}
                    id={`cancel--flow--${editingLog.flow_logs[i].id}`}
                    icon="remove"
                  />
                  <PT_BUTTON
                    handleClick={handleClick}
                    id={`submit--flow--${editingLog.flow_logs[i].id}`}
                    icon="check"
                  />
                </>
              }
              header={`${
                types.flow_types[editingLog.flow_logs[i].data.flow_typeId]
              }`}
              meta={
                editingLog[`flow_logs`][i] && (
                  <div className="edit-log-buttons">
                    {Object.keys(types.flow_types).map(keyName => (
                      <PT_BUTTON
                        key={keyName}
                        content={types.flow_types[keyName]}
                        value={`flow--${editingLog.flow_logs[i].id}--${keyName}--${i}`}
                        type="circular"
                        // active={item.id == selectedMood}
                        handleClick={handleTypeChange}
                        name="flow-type"
                      />
                    ))}
                  </div>
                )
              }
            />
          ) : (
            <PT_CARD
              id={item.id}
              key={item.id}
              description={
                <>
                  <PT_BUTTON
                    handleClick={handleClick}
                    id={`delete--flow--${item.id}`}
                    icon="trash"
                  />
                  <PT_BUTTON
                    handleClick={handleClick}
                    id={`edit--flow--${item.id}`}
                    icon="edit"
                  />
                </>
              }
              header={`${types.flow_types[item.data.flow_typeId]}`}
              meta={`${item.data.date}`}
            />
          );
        })}
      </Card.Group>

      <h1>Mood Logs</h1>
      <Card.Group stackable itemsPerRow={3}>
        {logs.mood_logs.map(item => {
          return item.isEditing ? (
            <PT_CARD
              id={item.id}
              key={item.id}
              description={
                <>
                  <PT_BUTTON
                    handleClick={handleClick}
                    id={`cancel--mood--${item.id}`}
                    icon="remove"
                  />
                  <PT_BUTTON
                    handleClick={handleClick}
                    id={`submit--mood--${item.id}`}
                    icon="check"
                  />
                </>
              }
              header={`${types.mood_types[item.data.mood_typeId]}`}
              meta={
                <div className="edit-log-buttons">
                  {Object.keys(types.mood_types).map((keyName, i) => (
                    <PT_BUTTON
                      key={keyName}
                      content={types.mood_types[keyName]}
                      value={`mood--${item.id}--${keyName}`}
                      type="circular"
                      // active={item.id == selectedMood}
                      handleClick={handleTypeChange}
                      name="mood-type"
                    />
                  ))}
                </div>
              }
            />
          ) : (
            <PT_CARD
              id={item.id}
              key={item.id}
              description={
                <>
                  <PT_BUTTON
                    handleClick={handleClick}
                    id={`delete--mood--${item.id}`}
                    icon="trash"
                  />
                  <PT_BUTTON
                    handleClick={handleClick}
                    id={`edit--mood--${item.id}`}
                    icon="edit"
                  />
                </>
              }
              header={`${types.mood_types[item.data.mood_typeId]}`}
              meta={`${item.data.date}`}
            />
          );
        })}
      </Card.Group>

      <h1>Note Logs</h1>
      <Card.Group stackable itemsPerRow={3}>
        {logs.note_logs.map(item => {
          return item.isEditing ? (
            <PT_CARD
              id={item.id}
              key={item.id}
              description={
                <>
                  <PT_BUTTON
                    handleClick={handleClick}
                    id={`cancel--note--${item.id}`}
                    icon="remove"
                  />
                  <PT_BUTTON
                    handleClick={handleClick}
                    id={`submit--note--${item.id}`}
                    icon="check"
                  />
                </>
              }
              header={`${item.data.content}`}
              meta={`${item.data.date}`}
            />
          ) : (
            <PT_CARD
              id={item.id}
              key={item.id}
              description={
                <>
                  <PT_BUTTON
                    handleClick={handleClick}
                    id={`delete--note--${item.id}`}
                    icon="trash"
                  />
                  <PT_BUTTON
                    handleClick={handleClick}
                    id={`edit--note--${item.id}`}
                    icon="edit"
                  />
                </>
              }
              header={`${item.data.content}`}
              meta={`${item.data.date}`}
            />
          );
        })}
      </Card.Group>
    </>
  );
};

export default MyLogs;
