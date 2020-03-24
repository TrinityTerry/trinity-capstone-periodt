import React, {useState} from "react";
import PT_CARD from "../../components/cards/PT_CARD";
import PT_ICON from "../../components/icons/PT_ICON";
import PT_INPUT from "../../components/inputs/PT_INPUT"
import {Form} from "semantic-ui";
const Set_Profile = ({ userData, userInfo }) => {
  const [userInfoInput, setUserInfoInput] = useState(userInfo);
  const [content, setContent] = useState("");
  const handleChange = e => {
    const newObj = { userInfoInput };
    newObj[e.target.name] = e.target.value;
    setUserInfoInput(newObj);
  };


  return (
    <>
      <PT_CARD
        cardArray={[
          {
            href: "/settings",
            key: userData.uid + "settings",
            header: "Go Back",
            
          }
        ]}
        indiv={false}
        centered={true}
      />
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
            key: userData.uid + "first",
            header: "First Name",
            description: (
              <PT_INPUT
                name="first_name"
                valueFromState={userInfoInput.first_name}
                handleChange={handleChange}
              />
            )
          },
          {
            key: userData.uid + "last",
            header: "Last Name",
            description: (
              <PT_INPUT
                name="last_name"
                valueFromState={userInfoInput.last_name}
                handleChange={handleChange}
              />
            )
          },
          {
            key: userData.uid + "nickname",
            header: "nickname",
            description: (
              <PT_INPUT
                name="nickname"
                valueFromState={userInfoInput.nickname}
                handleChange={handleChange}
              />
            )
          }

          // {
          //   key: userData.uid + "photo",
          //   header: "Photo URL",
          //   description: <PT_INPUT />
          // },
          // {
          //   key: userData.uid + "cycle",
          //   description: (
          //     <PT_INPUT
          //       disabled={true}
          //       name="averageCycleDays"
          //       valueFromState={userInfoInput.averageCycleDays}
          //       handleChange={handleChange}
          //     />
          //   ),
          //   header: "Average Cycle Length (Coming Soon)"
          // },
          // {
          //   key: userData.uid + "period",
          //   header: "Average Period Length (Coming Soon)",
          //   description: (
          //     <PT_INPUT
          //       disabled={true}
          //       name="averagePeriodDays"
          //       valueFromState={userInfoInput.averagePeriodDays}
          //       handleChange={handleChange}
          //     />
          //   )
          // },
          // {
          //   key: userData.uid + "color",
          //   header: "Color (Coming Soon)",
          //   description: (
          //     <PT_INPUT
          //       disabled={true}
          //       name="colorId"
          //       valueFromState={userInfoInput.colorId}
          //       handleChange={handleChange}
          //     />
          //   )
          // },
          // {
          //   key: userData.uid + "not",
          //   header: "Notifications (Coming Soon)",

          //   description: (
          //     <PT_INPUT
          //       disabled={true}
          //       name="notifications_enabled"
          //       valueFromState={userInfoInput.notifications_enabled}
          //       handleChange={handleChange}
          //     />
          //   )
          // },
          // {
          //   key: userData.uid + "timezone",
          //   header: "Timezone (Coming Soon)",
          //   description: (
          //     <PT_INPUT
          //       disabled={true}
          //       name="time_zone"
          //       valueFromState={userInfoInput.time_zone}
          //       handleChange={handleChange}
          //     />
          //   )
          // }
          // {
          //   key: userData.uid + "usertype",
          //   header: "User Type",
          //   description: <PT_INPUT />
          // }
        ]}
        indiv={false}
        centered={true}
      /> 
    </>
  );
};

export default Set_Profile;
