import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
}));

export default function LinearDeterminate({ progress = 0 }) {
  const classes = useStyles();
  return (
    <div className={classes.root, "progress-bar"}>
      <LinearProgress
        variant="determinate"
        value={progress}
        color="secondary"
      />
    </div>
  );
}
