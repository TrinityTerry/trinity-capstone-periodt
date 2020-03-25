import React, { useState } from "react";
import PT_CARD from "../../components/cards/PT_CARD";
import PT_INPUT from "../../components/inputs/PT_INPUT";
import PT_BUTTON from "../../components/buttons/PT_BUTTON";
import Set_Card from "../../components/cards/Set_Card";
import PT_CHECKBOX from "../../components/checkboxes/PT_CHECKBOX";

const Set_Cycle = ({ userData, userInfo }) => {
  const [cycleInfo, setCycleInfo] = useState(userInfo.settings);
  const handleSave = e => {
    console.log("save cycle");
  };

  const handleChange = e => {
    const newObj = { ...cycleInfo };

    if (e.target.id) {
      newObj[e.target.id] = e.target.checked;
    } else {
      console.log(Number.isNaN(Number(e.target.value)));

      if (!Number.isNaN(Number(e.target.value))) {
        newObj[e.target.name] = e.target.value;
      }
    }
    setCycleInfo(newObj);
  };

  const getValue = e => {
    console.log(e);
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
                valueFromState={cycleInfo.defaultCycle}
                handleChange={handleChange}
              />
            )
          },
          {
            key: userData.uid + "defaultPeriod",
            header: "Default Period Days",
            description: (
              <PT_INPUT
                name="defaultPeriod"
                valueFromState={cycleInfo.defaultPeriod}
                handleChange={handleChange}
              />
            )
          },
          {
            key: userData.uid + "ignoreMax",
            header: "Ignore Cycles Over",
            description: (
              <PT_INPUT
                name="ignoreMax"
                valueFromState={cycleInfo.ignoreMax}
                handleChange={handleChange}
              />
            )
          },
          {
            key: userData.uid + "ignoreMin",
            header: "Ignore Cycles Under",
            description: (
              <PT_INPUT
                name="ignoreMin"
                valueFromState={cycleInfo.ignoreMin}
                handleChange={handleChange}
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
                value={cycleInfo.useDefaultCycle}
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
