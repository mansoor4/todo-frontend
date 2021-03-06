import React from "react";
import classes from "./Error.module.css";
const Error = (props) => {
  const crossIcon = ["fas fa-times", classes.Cross];
  return (
    <div
      className={classes.Error}
      style={{ display: props.show ? "" : "none" }}
      onClick={props.clicked}
    >
      <span className={classes.Span}>{props.message}</span>
      <i className={crossIcon.join(" ")}></i>
    </div>
  );
};

export default Error;
