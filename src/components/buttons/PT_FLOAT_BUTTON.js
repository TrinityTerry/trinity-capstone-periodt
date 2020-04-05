import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import NavigationIcon from "@material-ui/icons/Navigation";

const useStyles = makeStyles((theme) => ({
  // margin: {
  //   margin: theme.spacing(1),
  // },
  // extendedIcon: {
  //   marginRight: theme.spacing(1),
  // },
}));

export default function FloatingActionButtonSize({
  size = "medium",
  variant = false,
  color = "secondary",
  content,
  fabClass,
  handleClick,
}) {
  const classes = useStyles();

  return (
    <div>
      <div>
        <Fab
          size={size}
          variant={variant}
          color={color}
          aria-label="add"
          className={(classes.margin, fabClass)}
          onClick={handleClick}
        >
          {content}
        </Fab>
      </div>
    </div>
  );
}
