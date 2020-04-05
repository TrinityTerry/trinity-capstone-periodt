import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import Slide from "@material-ui/core/Slide";
import Grow from "@material-ui/core/Grow";

export default function CustomizedSnackbars({
  snackObj,
  isOpen = false,
  handleClose = () => {
    console.log("add handle close function");
  },
  action,
  content = "add content",
  severity = "success",
  transition = Slide,
  snackClass = "pt-sitewide-snackbar",
  vertical = "top",
  horizontal = "center",
  autoHideDuration = 3000,
}) {
  return (
    <div>
      {snackObj ? (
        <Snackbar
          open={snackObj.isOpen ? snackObj.isOpen : isOpen}
          autoHideDuration={
            snackObj.autoHideDuration
              ? snackObj.autoHideDuration
              : autoHideDuration
          }
          onClose={snackObj.handleClose ? snackObj.handleClose : handleClose}
          TransitionComponent={
            snackObj.transition ? snackObj.transition : transition
          }
          className={snackObj.snackClass ? snackObj.snackClass : snackClass}
          anchorOrigin={{ vertical, horizontal }}
          message={snackObj.content ? snackObj.content : content}
          severity={snackObj.severity ? snackObj.severity : severity}
          action={snackObj.action ? snackObj.action : action}
        />
      ) : (
        <Snackbar
          open={isOpen}
          autoHideDuration={autoHideDuration}
          onClose={handleClose}
          TransitionComponent={transition}
          className={snackClass}
          anchorOrigin={{ vertical, horizontal }}
          message={content}
          severity={severity}
          action={action}
        />
      )}
    </div>
  );
}
