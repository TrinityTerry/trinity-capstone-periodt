import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import {
  Home,
  CalendarToday,
  Create,
  Book,
  Update,
  Settings
} from "@material-ui/icons";
import { withRouter } from "react-router-dom";
import * as moment from "moment";

const useStyles = makeStyles({
  root: {
    width: "90%",
    overflow: "hidden",
    padding: "0 10px",
    height: "60px"
  }
});

// title={"Periodt"}
// page={"home"}
// path={""}
// links={[
//   "Home",
//   "Add Log",
//   `My Calendar`,
//   `My Logs`,
//   "Cycle History",
//   "Predictions",
//   `Settings`
// ]}
// type={"bottomnav"}
const LabelBottomNavigation = ({ links, path, history }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState("recents");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // if (newValue == "calendar") {
    //   newValue = newValue + "#" + moment().format("YYYY-MM");
    // }
    history && history.push(path + "/" + newValue);
  };

  useEffect(() => {
    setValue(
      window.location.pathname.split("/")[1] == ""
        ? "home"
        : window.location.pathname.split("/")[1]
    );
  }, [window.location.pathname]);

  //   useEffect()
  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      className={(classes.root, "app-nav")}
      position="fixed"
      showLabels
    >
      {links.map(link => {
        const url = link
          .split(" ")
          .join("-")
          .split("'")
          .join("")
          .toLowerCase();
        return (
          <BottomNavigationAction
            key={url}
            label={link}
            value={url}
            icon={
              link == "Home" ? (
                <Home />
              ) : link == "Logs" ? (
                <Book />
              ) : link == "Calendar" ? (
                <CalendarToday />
              ) : link == "Trends" ? (
                <Update />
              ) : (
                link == "Add Log" && <Create />
              )
            }
          />
        );
      })}

      {/* <BottomNavigationAction
        label="Favorites"
        value="favorites"
        icon={<Favorite />}
      />
      <BottomNavigationAction
        label="Nearby"
        value="nearby"
        icon={<LocationOn />}
      />
      <BottomNavigationAction label="Folder" value="folder" icon={<Folder />} /> */}
    </BottomNavigation>
  );
};

export default withRouter(LabelBottomNavigation);
