import React, { useEffect, useState } from "react";
import PT_CARD from "../components/cards/PT_CARD";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_INPUT from "../components/inputs/PT_INPUT";
import { Card, Select } from "semantic-ui-react";
import * as firebase from "firebase";
import APIManager from "../modules/APIManager";
import PT_PROGRESS from "../components/loader/PT_PROGRESS";
/* 

setIsLoading((prevState) => {
          const newObj = { ...prevState };
          newObj.loading = false;
          newObj.progress = 0;
          return newObj;
        });

          
*/
const MyLogs = ({ userData, userInfo, setSnackbarObj }) => {
  const [logs, setLogs] = useState({
    mood_logs: [],
    note_logs: [],
    flow_logs: [],
  });
  const [isLoading, setIsLoading] = useState({
    loading: true,
    left: 0,
    progress: 0,
  });

  const [editingLog, setEditingLogs] = useState({});

  const [types, setTypes] = useState({
    mood_types: {},
    flow_types: {},
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

  useEffect(() => {
    firebase
      .database()
      .ref("flow_logs")
      .on("child_changed", (snapshot) => {
        getLogs();
      });

    firebase
      .database()
      .ref("mood_logs")
      .on("child_changed", (snapshot) => {
        getLogs();
      });

    firebase
      .database()
      .ref("mood_types")
      .on("child_changed", (snapshot) => {
        getNames();
      });

    firebase
      .database()
      .ref("flow_types")
      .on("child_changed", (snapshot) => {
        getNames();
      });
    firebase
      .database()
      .ref("note_logs")
      .on("child_changed", (snapshot) => {
        getLogs();
      });
  });

  const getNames = () => {
    const newObj = { ...types };
    APIManager.getResource(`mood_types`)
      .then((data) => {
        for (let props in data) {
          newObj.mood_types[props] = data[props].name;
        }
        setIsLoading((prevState) => {
          const newObj = { ...prevState };
          newObj.loading = true;
          newObj.progress = newObj.progress + 25;
          return newObj;
        });
      })
      .then(() => {
        APIManager.getResource(`flow_types`).then((data) => {
          for (let props in data) {
            newObj.flow_types[props] = data[props].name;
          }
          setIsLoading((prevState) => {
            const newObj = { ...prevState };
            newObj.progress = newObj.progress + 25;
            return newObj;
          });
          setTypes(newObj);
        });
      });
  };

  const getLogs = () => {
    const newObj = { ...logs };
    APIManager.getResource(`mood_logs/${userData.uid}`)
      .then((data) => {
        const newArray = [];
        for (let props in data) {
          newArray.push({
            data: data[props],
            id: props,
            isEditing: false,
            isLoading: false,
          });
        }
        newObj.mood_logs = newArray;
        setIsLoading((prevState) => {
          const newObj = { ...prevState };
          newObj.progress = newObj.progress + 15;
          return newObj;
        });
      })
      .then(() => {
        APIManager.getResource(`flow_logs/${userData.uid}`)
          .then((data) => {
            const newArray = [];
            for (let props in data) {
              newArray.push({
                data: data[props],
                id: props,
                isEditing: false,
                isLoading: false,
              });
            }
            newObj.flow_logs = newArray;
            setIsLoading((prevState) => {
              const newObj = { ...prevState };
              newObj.progress = newObj.progress + 15;
              return newObj;
            });
          })
          .then(() => {
            APIManager.getResource(`note_logs/${userData.uid}`).then((data) => {
              const newArray = [];
              for (let props in data) {
                newArray.push({
                  data: data[props],
                  id: props,
                  isEditing: false,
                  isLoading: false,
                });
              }
              newObj.note_logs = newArray;
              setLogs(newObj);
              setIsLoading((prevState) => {
                const newObj = { ...prevState };
                newObj.progress = newObj.progress + 20;
                return newObj;
              });
            });
          });
      });
  };

  useEffect(() => {
    setIsLoading((prevState) => {
      const newObj = { ...prevState };
      newObj.loading = true;
      newObj.progress = 0;
      return newObj;
    });
    getNames();
    getLogs();
  }, []);

  const handleClick = (e) => {
    const split = e.currentTarget.id.split("--");

    if (split[0] === "submit" && split[1] === "note") {
      APIManager.updateLog(`${split[1]}_logs/${userData.uid}/${split[2]}`, {
        [`content`]: editingLog[split[2]].content,
      }).then(() => {
        setSnackbarObj((prevState) => {
          const newObj = { ...prevState };
          newObj.isOpen = true;
          newObj.content = `Note Edited`;
          return newObj;
        });
      });
    } else if (split[0] === "edit") {
      if (split[1] === "note") {
        const obj = { ...editingLog };
        obj[split[2]] = { content: logs.note_logs[split[3]].data.content };

        setEditingLogs(obj);
      }

      const newObj = { ...logs };

      newObj[`${split[1]}_logs`][
        logs[`${split[1]}_logs`].findIndex((item) => item.id === split[2])
      ].isEditing = true;

      setLogs(newObj);
    } else if (split[0] === "submit") {
      const newObj = { ...logs };

      newObj[`${split[1]}_logs`][
        logs[`${split[1]}_logs`].findIndex((item) => item.id === split[2])
      ].isEditing = false;

      setLogs(newObj);
      APIManager.updateLog(`${split[1]}_logs/${userData.uid}/${split[2]}`, {
        [`${split[1]}_typeId`]: editingLog[split[2]].typeId,
      }).then(() => {
        setSnackbarObj((prevState) => {
          const newObj = { ...prevState };
          newObj.isOpen = true;
          newObj.content = `Log Edited`;
          return newObj;
        });
      });
    } else if (split[0] === "cancel") {
      const newObj = { ...logs };

      newObj[`${split[1]}_logs`][
        logs[`${split[1]}_logs`].findIndex((item) => item.id === split[2])
      ].isEditing = false;

      setLogs(newObj);
    } else if (split[0] === "delete") {
      const newObj = { ...logs };
      // console.log(newObj, split);

      newObj[`${split[1]}_logs`][
        logs[`${split[1]}_logs`].findIndex((item) => item.id === split[2])
      ].isLoading = true;
      setLogs(newObj);

      APIManager.deleteLog(`${split[1]}_logs`, userData.uid, split[2]).then(
        (data) => {
          setSnackbarObj((prevState) => {
            const newObj = { ...prevState };
            newObj.isOpen = true;
            newObj.content = `Log Deleted`;
            newObj.action = (
              <PT_BUTTON
                content="Undo"
                handleClick={() => {
                  APIManager.updateLog(
                    `${split[1]}_logs/${userData.uid}/${split[0]}`,
                    data.deleting
                  );
                  setSnackbarObj((prevState) => {
                    const newObj = { ...prevState };
                    newObj.action = null;
                    return newObj;
                  });
                }}
                size="small"
              />
            );

            return newObj;
          });
        }
      );
    }
  };

  const handleTypeChange = (e, { value, name }) => {
    const newObj = { ...editingLog };
    if (name !== undefined) {
      const split = name.split("--");
      const editingIndex = split[3];
      newObj[split[1]] = { catName: split[0], content: value };
    } else {
      const split = value.split("--");
      const editingIndex = split[3];
      newObj[split[1]] = { catName: split[0], typeId: split[2] };
    }

    setEditingLogs(newObj);
  };

  return (
    <>
      {isLoading.loading && <PT_PROGRESS progress={isLoading.progress} />}

      <h1>Flow Logs</h1>

      <Card.Group stackable itemsPerRow={3}>
        {logs.flow_logs.map((item, i) => {
          return item.isEditing ? (
            <PT_CARD
              id={logs.flow_logs[i].id}
              key={logs.flow_logs[i].id}
              extra={
                <>
                  <PT_BUTTON
                    handleClick={handleClick}
                    id={`cancel--flow--${logs.flow_logs[i].id}`}
                    icon="remove"
                  />

                  <PT_BUTTON
                    handleClick={handleClick}
                    id={`submit--flow--${logs.flow_logs[i].id}`}
                    icon="check"
                    disabled={editingLog[logs.flow_logs[i].id] === undefined}
                  />
                </>
              }
              header={
                logs[`flow_logs`][i] && (
                  <>
                    <Select
                      placeholder={`${types.flow_types[item.data.flow_typeId]}`}
                      options={Object.keys(types.flow_types).map((keyName) => {
                        return {
                          key: keyName,
                          value: `flow--${logs.flow_logs[i].id}--${keyName}--${i}`,
                          text: types.flow_types[keyName],
                        };
                      })}
                      onChange={handleTypeChange}
                    />
                  </>
                )
              }
            />
          ) : (
            <PT_CARD
              id={item.id}
              key={item.id}
              extra={
                <>
                  <PT_BUTTON
                    loading={item.isLoading}
                    handleClick={handleClick}
                    id={`delete--flow--${item.id}`}
                    icon="trash"
                    disabled={item.isLoading}
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
        {logs.mood_logs.map((item, i) => {
          return item.isEditing ? (
            <PT_CARD
              id={item.id}
              key={item.id}
              extra={
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
                    disabled={editingLog[logs.mood_logs[i].id] === undefined}
                  />
                </>
              }
              header={
                logs[`mood_logs`][i] && (
                  <>
                    <Select
                      placeholder={`${types.mood_types[item.data.mood_typeId]}`}
                      options={Object.keys(types.mood_types).map((keyName) => {
                        return {
                          key: keyName,
                          value: `mood--${logs.mood_logs[i].id}--${keyName}--${i}`,
                          text: types.mood_types[keyName],
                        };
                      })}
                      onChange={handleTypeChange}
                    />
                  </>
                )
              }
            />
          ) : (
            <PT_CARD
              id={item.id}
              key={item.id}
              extra={
                <>
                  <PT_BUTTON
                    loading={item.isLoading}
                    handleClick={handleClick}
                    id={`delete--mood--${item.id}`}
                    disabled={item.isLoading}
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
        {logs.note_logs.map((item, i) => {
          return item.isEditing ? (
            <PT_CARD
              id={item.id}
              key={item.id}
              extra={
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
              header={
                <PT_INPUT
                  type="textarea"
                  inputId="note-area"
                  handleChange={handleTypeChange}
                  valueFromState={
                    editingLog[logs.note_logs[i].id] &&
                    editingLog[logs.note_logs[i].id].content
                  }
                  name={`note--${logs.note_logs[i].id}--${i}`}
                />
              }
            />
          ) : (
            <PT_CARD
              id={item.id}
              key={item.id}
              extra={
                <>
                  <PT_BUTTON
                    loading={item.isLoading}
                    disabled={item.isLoading}
                    handleClick={handleClick}
                    id={`delete--note--${item.id}--${i}`}
                    icon="trash"
                  />
                  <PT_BUTTON
                    handleClick={handleClick}
                    id={`edit--note--${item.id}--${i}`}
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
