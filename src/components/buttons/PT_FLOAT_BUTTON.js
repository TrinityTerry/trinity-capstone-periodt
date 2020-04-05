import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import NavigationIcon from "@material-ui/icons/Navigation";

export default function FloatingActionButtonSize({
  size = "medium",
  variant = "extended",
  color = "secondary",
  content,
  fabClass,
  handleClick,
}) {

  return (
    <div>
      <div>
        <Fab
          size={size}
          variant={variant}
          color={color}
          aria-label="add"
          className={fabClass}
          onClick={handleClick}
        >
          {content}
        </Fab>
      </div>
    </div>
  );
}
