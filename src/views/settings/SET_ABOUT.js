import React, { useState } from "react";
import PT_CARD from "../../components/cards/PT_CARD";
import PT_BUTTON from "../../components/buttons/PT_BUTTON";
import PT_CALENDAR from "../../components/calendar/PT_CALENDAR";
import PT_ICON from "../../components/icons/PT_ICON";
import Set_Card from "../../components/cards/Set_Card";
const Set_Home = ({ userData, userInfo }) => {
  return (
    <>
      <Set_Card title="About Page" userData={userData} userInfo={userInfo} />
      <PT_CARD
        cardArray={[
          {
            key: "info",
            header: (<h2>About <em>Periodt.</em></h2>),
            description:
              (<><p><em>Periodt.</em> is an intelligent period tracker designed for people who menstruate regardless of gender and age. This application makes tracking a period easier while also reducing the social anxiety around tracking periods in public.</p><p> Trinity Terry built <em>Periodt.</em> for her Front-End Capstone as a student at Nashville Software School in May-April 2019.</p></>)
          }
          ,
          {
            key: "credits",
            header: "Credits",
            description: (
              <>
                <hr />
                <p>
                  Mood Icons from the{" "}
                  <a href="https://www.streamlineicons.com/">
                    Streamline Icons Pack
                  </a>
                </p>
                <p>
                  Flow Icon made by{" "}
                  <a href="https://www.flaticon.com/authors/freepik">Freepik</a>{" "}
                  from <a href="www.flaticon.com">www.flaticon.com</a>
                </p>
                <p>
                  Components from {" "}
                  <a href="https://reactstrap.github.io/">
                    reactstrap
                  </a>, {" "}
                  <a href="https://react.semantic-ui.com/">Semantic UI React</a>, and{" "}
                  <a href="https://material-ui.com/">Material-UI</a>{" "}
                </p>
                <p>
                Styled using {" "}
                  <a href="https://sass-lang.com/">Sass</a>{" "}
                </p>
                <p>
            Built using {" "}
                  <a href="https://reactjs.org/">React</a>{" "} Javascript Librairy
                  
                </p>
                <p>Database, Authentication and Cloud Storage using {" "}
                  <a href="https://firebase.google.com/">Firebase</a>{" "}
                </p>
                <p>Dates and time manipulation using {" "}
                  <a href="https://momentjs.com/">Moment.js</a>{" "}
                </p>

              </>
            )
          }
          ,
         
          {
            key: "links",
            header: "Links",
            extra: (
              <>
                <a href="https://github.com/TrinityTerry/trinity-capstone-periodt">
                  <PT_ICON size="big" link={true} name="github" />
                </a>
                <a href="https://www.linkedin.com/in/trinityterry/">
                  <PT_ICON size="big" link={true} name="linkedin" />
                </a>
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

export default Set_Home;
