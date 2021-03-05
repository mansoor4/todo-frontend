import React from "react";
import classes from "./Button.module.css"
const Button = (props) => {
  const buttonClass = [classes.Button];
  if(props.class==="Success")
  {
      buttonClass.push(classes.Success)
  }
  if(props.class==="Danger")
  {
      buttonClass.push(classes.Danger)
  }
  return <button  onClick={props.change} className={buttonClass.join(" ")}>{props.title}</button>;
};

export default Button;
