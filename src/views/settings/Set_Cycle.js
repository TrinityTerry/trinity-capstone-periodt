import React, { useState } from "react";
import PT_CARD from "../../components/cards/PT_CARD";
import PT_INPUT from "../../components/inputs/PT_INPUT";
import PT_BUTTON from "../../components/buttons/PT_BUTTON";
import Set_Card from "../../components/cards/Set_Card";
import PT_CHECKBOX from "../../components/checkboxes/PT_CHECKBOX";
import APIManager from "../../modules/APIManager";

const Set_Cycle = ({ userData, userInfo }) => {
  const [cycleInfo, setCycleInfo] = useState(userInfo);
  const handleSave = e => {
    APIManager.updateUser(cycleInfo, userData.uid);
  };

  const handleChange = e => {
    const newObj = { ...cycleInfo };

    if (e.target.id) {
      newObj.settings[e.target.id] = e.target.checked;
    } else {
      if (!Number.isNaN(Number(e.target.value)) && e.target.value.length <= 2) {
        newObj.settings[e.target.name] = e.target.value;

        if (e.target.value.length == 0) {
          newObj.settings[e.target.name] = 0;
        }
      }
    }

    setCycleInfo(newObj);
  };

  return (
    <>
      <Set_Card
        title="Cycle"
        userData={userData}
        userInfo={userInfo}
        handleClick={handleSave}
      />
      <PT_CARD
        cardArray={[
          {
            key: userData.uid + "defaultCycle",
            header: "Default Cycle Days",
            description: (
              <PT_INPUT
                name="defaultCycle"
                type="number"
                valueFromState={cycleInfo.settings.defaultCycle}
                handleChange={handleChange}
                max={99}
                min={10}
              />
            )
          },
          {
            key: userData.uid + "defaultPeriod",
            header: "Default Period Days",
            description: (
              <PT_INPUT
                type="number"
                name="defaultPeriod"
                valueFromState={cycleInfo.settings.defaultPeriod}
                handleChange={handleChange}
                max={cycleInfo.settings.defaultCycle - 5}
                min={1}
              />
            )
          },
          {
            key: userData.uid + "ignoreMax",
            header: "Ignore Cycles Over",
            description: (
              <PT_INPUT
                name="ignoreMax"
                type="number"
                valueFromState={cycleInfo.settings.ignoreMax}
                handleChange={handleChange}
                min={cycleInfo.settings.ignoreMin + 5}
                max={99}
              />
            )
          },
          {
            key: userData.uid + "ignoreMin",
            header: "Ignore Cycles Under",
            description: (
              <PT_INPUT
                name="ignoreMin"
                type="number"
                valueFromState={cycleInfo.settings.ignoreMin}
                handleChange={handleChange}
                max={cycleInfo.settings.ignoreMax - 5}
                min={0}
              />
            )
          },
          {
            key: userData.uid + "useDefaultCycle",
            header: "Use Default Cycle",
            meta: "Instead of calculated averages",
            description: (
              // <PT_INPUT
              //   name="useDefaultCycle"
              //   valueFromState={cycleInfo.useDefaultCycle}
              //   handleChange={handleChange}
              // />
              <PT_CHECKBOX
                checkId="useDefaultCycle"
                value={cycleInfo.settings.useDefaultCycle}
                handleChange={handleChange}
              />
            )
          },
          {
            key: userData.uid + "save",
            description: <PT_BUTTON content="Save" handleClick={handleSave} />
          }
        ]}
        indiv={false}
        centered={true}
      />
    </>
  );
};

export default Set_Cycle;
