import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./Navitem.module.css";
const Navitem = (props) => {
  const activeStyle = { color: "orange" };
  return (
    <div className={classes.Navitem}>
      <NavLink activeStyle={activeStyle} to={props.path}>
        {props.children}
      </NavLink>
    </div>
  );
};
export default Navitem;
