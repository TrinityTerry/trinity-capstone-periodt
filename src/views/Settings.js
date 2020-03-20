import React, { useState } from "react";
import PT_CARD from "../components/cards/PT_CARD";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import PT_CALENDAR from "../components/calendar/PT_CALENDAR";
const Settings = ({ userData, userInfo }) => {
  const [isEditing, setIsEditing] = useState({
    averageCycleDays: false,
    averagePeriodDays: false,
    colorId: false,
    first_name: false,
    last_name: false,
    photoURL: false,
    time_zone: false,
    user_typeId: false,
    username: false
  });

  return (
    <>
      <PT_CARD
        image={
          userInfo.photoURL
            ? userInfo.photoURL
            : "https://react.semantic-ui.com/images/wireframe/white-image.png"
        }
        centered={true}
      />
      <PT_CARD
        cardArray={[
          {
              key: userData.uid + "photo",
            description: isEditing.photoURL ? (
              <input></input>
            ) : (
              <>
                <div>Photo URL</div>
                <div>
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`cancel--flow--${logs.flow_logs[i].id}`}
                    icon="remove"
                  />
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`submit--flow--${logs.flow_logs[i].id}`}
                    icon="check"
                    //   disabled={editingLog[logs.flow_logs[i].id] == undefined}
                  />
                </div>
              </>
            )
          },
          {
            key: userData.uid + "cycle",
            description: isEditing.averageCycleDays ? (
              <input></input>
            ) : (
              <>
                <div>Average Cycle Days</div>
                <div>
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`cancel--flow--${logs.flow_logs[i].id}`}
                    icon="remove"
                  />
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`submit--flow--${logs.flow_logs[i].id}`}
                    icon="check"
                    //   disabled={editingLog[logs.flow_logs[i].id] == undefined}
                  />
                </div>
              </>
            )
          },
          {
            key: userData.uid + "period",
            description: isEditing.averagePeriodDays ? (
              <input></input>
            ) : (
              <>
                <div>Average Cycle Days</div>
                <div>
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`cancel--flow--${logs.flow_logs[i].id}`}
                    icon="remove"
                  />
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`submit--flow--${logs.flow_logs[i].id}`}
                    icon="check"
                    //   disabled={editingLog[logs.flow_logs[i].id] == undefined}
                  />
                </div>
              </>
            )
          },
          {
            key: userData.uid + "color",
            description: isEditing.colorId ? (
              <input></input>
            ) : (
              <>
                <div>Color Id</div>
                <div>
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`cancel--flow--${logs.flow_logs[i].id}`}
                    icon="remove"
                  />
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`submit--flow--${logs.flow_logs[i].id}`}
                    icon="check"
                    //   disabled={editingLog[logs.flow_logs[i].id] == undefined}
                  />
                </div>
              </>
            )
          },
          {
            key: userData.uid + "first",
            description: isEditing.first_name ? (
              <input></input>
            ) : (
              <>
                <div>First Name</div>
                <div>
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`cancel--flow--${logs.flow_logs[i].id}`}
                    icon="remove"
                  />
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`submit--flow--${logs.flow_logs[i].id}`}
                    icon="check"
                    //   disabled={editingLog[logs.flow_logs[i].id] == undefined}
                  />
                </div>
              </>
            )
          },
          {
            key: userData.uid + "last",
            description: isEditing.last_name ? (
              <input></input>
            ) : (
              <>
                <div>Last Name</div>
                <div>
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`cancel--flow--${logs.flow_logs[i].id}`}
                    icon="remove"
                  />
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`submit--flow--${logs.flow_logs[i].id}`}
                    icon="check"
                    //   disabled={editingLog[logs.flow_logs[i].id] == undefined}
                  />
                </div>
              </>
            )
          },
          {
            key: userData.uid + "not",
            description: (
              <>
                <div>Notifications</div>
                <div>
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`cancel--flow--${logs.flow_logs[i].id}`}
                    icon="remove"
                  />
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`submit--flow--${logs.flow_logs[i].id}`}
                    icon="check"
                    //   disabled={editingLog[logs.flow_logs[i].id] == undefined}
                  />
                </div>
              </>
            )
          },
          {
            key: userData.uid + "timezone",
            description: isEditing.time_zone ? (
              <input></input>
            ) : (
              <>
                <div>Timezone</div>
                <div>
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`cancel--flow--${logs.flow_logs[i].id}`}
                    icon="remove"
                  />
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`submit--flow--${logs.flow_logs[i].id}`}
                    icon="check"
                    //   disabled={editingLog[logs.flow_logs[i].id] == undefined}
                  />
                </div>
              </>
            )
          },
          {
            key: userData.uid + "usertype",
            description: isEditing.user_typeId ? (
              <input></input>
            ) : (
              <>
                <div>User Types</div>
                <div>
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`cancel--flow--${logs.flow_logs[i].id}`}
                    icon="remove"
                  />
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`submit--flow--${logs.flow_logs[i].id}`}
                    icon="check"
                    //   disabled={editingLog[logs.flow_logs[i].id] == undefined}
                  />
                </div>
              </>
            )
          },
          {
            key: userData.uid + "username",
            description: isEditing.username ? (
              <input></input>
            ) : (
              <>
                <div>Username</div>
                <div>
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`cancel--flow--${logs.flow_logs[i].id}`}
                    icon="remove"
                  />
                  <PT_BUTTON
                    //   handleClick={handleClick}
                    //   id={`submit--flow--${logs.flow_logs[i].id}`}
                    icon="check"
                    //   disabled={editingLog[logs.flow_logs[i].id] == undefined}
                  />
                </div>
              </>
            )
          }
        ]}
        indiv={false}
        centered={true}
      />
    </>
  );
};

export default Settings;
