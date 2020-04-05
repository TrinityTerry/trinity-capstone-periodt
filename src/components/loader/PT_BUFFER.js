import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

export default function LinearBuffer({
  cycleDays = 28,
  periodDays = 4,
  longest = 60,
}) {
  const [completed, setCompleted] = React.useState(0);
  const [buffer, setBuffer] = React.useState(0);

  React.useEffect(() => {
    setBuffer((cycleDays / longest) * 100);
    setCompleted((periodDays / longest) * 100);
  }, []);

  return (
    <div>
      <LinearProgress variant="buffer" value={completed} valueBuffer={buffer} />
    </div>
  );
}
