import React from "react";
import Aux from "../../HOC/Auxillary/Auxillary";
import classes from "./Modal.module.css";
const Modal = (props) => {
  return (
    <Aux>
      <div className={classes.Modal}>
       {props.children}
      </div>
    </Aux>
  );
};

export default Modal;
