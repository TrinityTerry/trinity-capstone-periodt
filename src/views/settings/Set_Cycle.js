import React, { useState, useEffect } from "react";
import PT_CARD from "../../components/cards/PT_CARD";
import PT_INPUT from "../../components/inputs/PT_INPUT";
import PT_BUTTON from "../../components/buttons/PT_BUTTON";
import PT_ICON from "../../components/icons/PT_ICON";
import Set_Card from "../../components/cards/Set_Card";
import PT_CHECKBOX from "../../components/checkboxes/PT_CHECKBOX";
import APIManager from "../../modules/APIManager";
import { Link } from "react-router-dom";
import PT_PROGRESS from "../../components/loader/PT_PROGRESS";
const Set_Cycle = ({ userData, userInfo, match, setSnackbarObj }) => {
  const [cycleInfo, setCycleInfo] = useState(userInfo);
  const handleSave = (e) => {
    setIsLoading((prevState) => {
      const newObj = { ...prevState };
      newObj.loading = true;
      newObj.progress = 0;
      return newObj;
    });
    APIManager.updateUser(cycleInfo, userData.uid).then(() => {
      setIsLoading((prevState) => {
        const newObj = { ...prevState };
        newObj.loading = true;
        newObj.progress = 100;
        return newObj;
      });
      setSnackbarObj((prevState) => {
        const newObj = { ...prevState };
        newObj.isOpen = true;
        newObj.content = "Cycle Settings Updated";
        return newObj;
      });
    });
  };
  const [isLoading, setIsLoading] = useState({
    loading: false,
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
  const handleChange = (e) => {
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
      {isLoading.loading && <PT_PROGRESS progress={isLoading.progress} />}
      <Set_Card
        title="Cycle"
        userData={userData}
        userInfo={userInfo}
        handleClick={handleSave}
      />
      <PT_CARD
      groupClass="settings-card-group"
      itemsPerRow={1}
        cardArray={[
          {
            key: "history",
            header: (
              <Link to="history">
                <div className="set-nav-card">
                  <h2>Cycle History</h2>
                  <PT_ICON name="angle right" />
                </div>
              </Link>
            ),
          },
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
                className="settings-profile-inputs"
              />
            ),
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
                className="settings-profile-inputs"
              />
            ),
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
                className="settings-profile-inputs"
              />
            ),
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
                className="settings-profile-inputs"
              />
            ),
          },
          {
            key: userData.uid + "useDefaultCycle",
            header: "Use Default Cycle",
            meta: "Instead of calculated averages",
            description: (
              <PT_CHECKBOX
                checkId="useDefaultCycle"
                value={cycleInfo.settings.useDefaultCycle}
                handleChange={handleChange}
              />
            ),
          },

          {
            key: userData.uid + "save",
            description: <PT_BUTTON content="Save" handleClick={handleSave} />,
          },
        ]}
        indiv={false}
        centered={true}
      />
    </>
  );
};

export default Set_Cycle;
