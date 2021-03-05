import React from "react";
import classes from "./TodoList.module.css";
import TodoDetail from "../../TodoDetail/TodoDetail";
const TodoList = (props) => {
  const completeClasses = ["fa fa-check complete", classes.Complete];
  const deleteClasses = ["fa fa-trash delete", classes.Delete];
  const arrowClasses = ["fas fa-arrow-right", classes.Arrow];
  const textClasses = [classes.Text];
  const containClasses = [classes.ItemContain];
  if (props.completed) {
    textClasses.push(classes.Completed);
  }

  if (props.deleted) {
    containClasses.push(classes.Deleted);
  }
  return (
    <div>
      <div
        style={{ display: props.display ? "" : "none" }}
        className={containClasses.join(" ")}
      >
        <span onMouseEnter={props.enter} className={textClasses.join(" ")}>
          <span>{props.text}</span>
          <i
            className={arrowClasses.join(" ")}
            onClick={() => props.toggleDetail(props.id)}
          ></i>
        </span>
        <i
          onClick={(event) => props.toggle(event, props.id)}
          className={completeClasses.join(" ")}
        ></i>
        <i
          onClick={() => props.deleteClick(props.id)}
          className={deleteClasses.join(" ")}
        ></i>
      </div>
      <TodoDetail
        title={props.text}
        description={props.description}
        display={props.detailDisplay}
        closeDetail={props.closeDetail}
        id={props.id}
        updateShow={props.updateShow}
        updateClose={props.updateClose}
        update={props.update}
        closeUpdateAndDetail={props.closeUpdateAndDetail}
        updateTodo={props.updateTodo}
      ></TodoDetail>
    </div>
  );
};

export default TodoList;
