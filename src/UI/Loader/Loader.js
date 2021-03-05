import React from "react";
import classes from "./Loader.module.css"
const Loader = (props) => {
  return <div style={props.style} className={classes.Loader}>Loading...</div>;
};

export default Loader;
