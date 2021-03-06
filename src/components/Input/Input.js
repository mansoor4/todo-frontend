import React from "react";
import classes from "./Input.module.css";
const Input = (props) => {
  let input = null;
  const inputClasses = [props.class];
  if (props.showError) {
    inputClasses.push(classes.Error);
  }
  switch (props.inputType) {
    case "input":
      input = (
        <input
          {...props.config}
          onChange={(event) => props.change(event, props.inputName)}
          className={inputClasses.join(" ")}
          value={props.value}
        />
      );
      break;
    case "textarea":
      input = (
        <textarea
          {...props.config}
          onChange={(event) => props.change(event, props.inputName)}
          className={inputClasses.join(" ")}
          value={props.value}
        />
      );
      break;
    case "select":
      input = (
        <select
          value={props.value}
          className={inputClasses.join(" ")}
          onChange={(event) => props.change(event, props.inputName)}
        >
          {props.config.option.map((opt) => {
            return (
              <option
                className={props.optionClass}
                key={opt.value}
                value={opt.value}
              >
                {opt.displayValue}
              </option>
            );
          })}
        </select>
      );
      break;
    default:
      input = (
        <input
          {...props.config}
          className={inputClasses.join(" ")}
          value={props.value}
          onChange={(event) => props.change(event, props.inputName)}
        />
      );
  }
  return input;
};

export default Input;
